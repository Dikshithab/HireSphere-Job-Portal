package com.jobportal.backend.service;

import com.jobportal.backend.dto.JobResponse;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class ChatbotService {

    private final RestClient restClient;
    private final JobService jobService;

    public ChatbotService(JobService jobService) {

        this.jobService = jobService;

        this.restClient = RestClient.builder()
                .baseUrl("https://api.groq.com/openai/v1")
                .build();
    }

    public String ask(String userMessage) {

        String apiKey = System.getenv("GROQ_API_KEY");

        if (apiKey == null || apiKey.isBlank()) {

            System.out.println("========== GROQ ERROR ==========");
            System.out.println("GROQ_API_KEY is missing!");
            System.out.println("================================");

            return "Groq API key is not configured.";
        }

        try {

            /*
             * =====================================================
             * STEP 1: SEARCH HIRESHERE JOBS
             * =====================================================
             *
             * For the first version, we use the user's complete
             * message as the keyword.
             *
             * Example:
             *
             * "Find Java developer jobs"
             *
             * will search:
             *
             * title
             * description
             * requirements
             * skills
             *
             * through the existing JobService.searchJobs().
             */

            List<JobResponse> matchingJobs =
                    jobService.searchJobs(
                            userMessage,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null
                    );

            /*
             * Limit the number of jobs sent to Groq.
             *
             * This prevents sending a huge amount of database
             * information to the AI.
             */

            List<JobResponse> limitedJobs =
                    matchingJobs.stream()
                            .limit(10)
                            .toList();

            /*
             * =====================================================
             * STEP 2: BUILD JOB DATA FOR AI
             * =====================================================
             */

            StringBuilder jobContext =
                    new StringBuilder();

            if (limitedJobs.isEmpty()) {

                jobContext.append(
                        "No matching active jobs were found in HireSphere."
                );

            } else {

                jobContext.append(
                        "The following are REAL ACTIVE JOBS currently available in HireSphere:\n\n"
                );

                for (JobResponse job : limitedJobs) {

                    jobContext.append(
                            "Job ID: "
                    ).append(job.getId());

                    jobContext.append(
                            "\nTitle: "
                    ).append(job.getTitle());

                    jobContext.append(
                            "\nCompany: "
                    ).append(job.getCompanyName());

                    jobContext.append(
                            "\nLocation: "
                    ).append(job.getLocation());

                    jobContext.append(
                            "\nJob Type: "
                    ).append(job.getJobType());

                    jobContext.append(
                            "\nExperience: "
                    ).append(job.getExperienceLevel());

                    jobContext.append(
                            "\nSkills: "
                    ).append(job.getSkills());

                    jobContext.append(
                            "\nSalary: "
                    ).append(job.getSalary());

                    jobContext.append(
                            "\nRemote: "
                    ).append(job.getRemote());

                    jobContext.append(
                            "\nApplication Deadline: "
                    ).append(job.getApplicationDeadline());

                    jobContext.append(
                            "\nStatus: "
                    ).append(job.getStatus());

                    jobContext.append(
                            "\nDescription: "
                    ).append(job.getDescription());

                    jobContext.append(
                            "\n-----------------------------\n"
                    );
                }
            }

            /*
             * =====================================================
             * STEP 3: SYSTEM PROMPT
             * =====================================================
             */

            String systemPrompt =

                    "You are HireSphere AI, the official AI assistant "
                    + "for the HireSphere job portal. "

                    + "Your job is to help users understand and use HireSphere. "

                    + "HireSphere allows job seekers to: "
                    + "create an account, browse jobs, view job details, "
                    + "apply for jobs, track applications, upload resumes, "
                    + "analyze resumes using ATS analysis, identify missing "
                    + "skills, and receive career recommendations. "

                    + "HireSphere allows employers to: "
                    + "create a company profile, create job postings, "
                    + "manage their jobs, view applications, and manage candidates. "

                    + "\n\nIMPORTANT JOB SEARCH RULES:\n"

                    + "You have been provided with REAL ACTIVE JOBS "
                    + "from the HireSphere database below. "

                    + "When the user asks about available jobs, job openings, "
                    + "companies hiring, or asks to find a job, use ONLY "
                    + "the provided job data. "

                    + "Never invent a job, company, salary, location, "
                    + "skill, deadline, or other job information. "

                    + "If no matching jobs are provided, clearly tell the "
                    + "user that no matching active jobs were found. "

                    + "Do not claim that you applied for a job or performed "
                    + "any action unless the system actually provides that capability. "

                    + "When listing jobs, keep the information concise "
                    + "and useful. "

                    + "\n\nHIR​ESHERE JOB DATA:\n"
                    + jobContext;

            /*
             * =====================================================
             * STEP 4: GROQ REQUEST
             * =====================================================
             */

            Map<String, Object> request = Map.of(

                    "model",
                    "openai/gpt-oss-120b",

                    "messages",
                    List.of(

                            Map.of(
                                    "role",
                                    "system",

                                    "content",
                                    systemPrompt
                            ),

                            Map.of(
                                    "role",
                                    "user",

                                    "content",
                                    userMessage
                            )
                    ),

                    "temperature",
                    0.7
            );

            /*
             * =====================================================
             * STEP 5: CALL GROQ
             * =====================================================
             */

            Map response = restClient.post()

                    .uri("/chat/completions")

                    .header(
                            "Authorization",
                            "Bearer " + apiKey
                    )

                    .contentType(
                            MediaType.APPLICATION_JSON
                    )

                    .body(request)

                    .retrieve()

                    .body(Map.class);

            /*
             * =====================================================
             * STEP 6: READ RESPONSE
             * =====================================================
             */

            if (response != null &&

                    response.get("choices")
                            instanceof List<?> choices &&

                    !choices.isEmpty()) {

                Map firstChoice =
                        (Map) choices.get(0);

                if (firstChoice.get("message")
                        instanceof Map message) {

                    Object content =
                            message.get("content");

                    if (content != null) {

                        return content.toString();
                    }
                }
            }

            return "Sorry, I couldn't generate a response.";

        } catch (Exception e) {

            System.out.println(
                    "========== CHATBOT ERROR =========="
            );

            System.out.println(
                    "TYPE: "
                            + e.getClass().getName()
            );

            System.out.println(
                    "MESSAGE: "
                            + e.getMessage()
            );

            System.out.println(
                    "==================================="
            );

            return "Sorry, I'm unable to respond right now.";
        }
    }
}