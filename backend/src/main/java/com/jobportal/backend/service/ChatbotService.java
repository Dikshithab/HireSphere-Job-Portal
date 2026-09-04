package com.jobportal.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    private final ObjectMapper objectMapper;

    public ChatbotService(JobService jobService) {

        this.jobService = jobService;

        this.restClient = RestClient.builder()
                .baseUrl("https://api.groq.com/openai/v1")
                .build();

        this.objectMapper = new ObjectMapper();
    }

    public ChatbotResult ask(String userMessage) {

        String apiKey = System.getenv("GROQ_API_KEY");

        if (apiKey == null || apiKey.isBlank()) {

            System.out.println("========== GROQ ERROR ==========");
            System.out.println("GROQ_API_KEY is missing!");
            System.out.println("================================");

            return new ChatbotResult(
                    "Groq API key is not configured.",
                    List.of()
            );
        }

        if (userMessage == null || userMessage.isBlank()) {

            return new ChatbotResult(
                    "Please enter a message.",
                    List.of()
            );
        }

        try {

            /*
             * =====================================================
             * STEP 1: ASK GROQ TO UNDERSTAND THE USER'S JOB SEARCH
             * =====================================================
             */

            String filterPrompt = """
                    You are a job search filter extractor for HireSphere.

                    Analyze the user's message and determine whether they
                    are searching for jobs.

                    Return ONLY valid JSON.
                    Do not use markdown.
                    Do not use code fences.
                    Do not add explanations.

                    JSON format:

                    {
                      "isJobSearch": true,
                      "keyword": null,
                      "location": null,
                      "jobType": null,
                      "experienceLevel": null,
                      "remote": null,
                      "minSalary": null,
                      "maxSalary": null
                    }

                    Rules:

                    - keyword should contain the main job-related skill,
                      technology, role, or title.
                    - location should contain the requested location.
                    - jobType may be Full-time, Part-time, Contract,
                      Internship, etc. only when clearly requested.
                    - experienceLevel should only be filled when the user
                      clearly specifies an experience level.
                    - remote should be true for remote jobs and false for
                      explicitly non-remote jobs.
                    - Salary values must be numeric Indian Rupees.
                    - If the user says "5 LPA", minSalary should be 500000.
                    - If the user says "10 LPA", maxSalary should be 1000000.
                    - If a filter is not mentioned, use null.
                    - If the message is not a job search, isJobSearch
                      must be false.

                    Examples:

                    User:
                    Find Java developer jobs in Hyderabad with 5+ LPA

                    JSON:
                    {
                      "isJobSearch": true,
                      "keyword": "Java",
                      "location": "Hyderabad",
                      "jobType": null,
                      "experienceLevel": null,
                      "remote": null,
                      "minSalary": 500000,
                      "maxSalary": null
                    }

                    User:
                    Find remote Python jobs

                    JSON:
                    {
                      "isJobSearch": true,
                      "keyword": "Python",
                      "location": null,
                      "jobType": null,
                      "experienceLevel": null,
                      "remote": true,
                      "minSalary": null,
                      "maxSalary": null
                    }

                    User:
                    Show me Spring Boot jobs

                    JSON:
                    {
                      "isJobSearch": true,
                      "keyword": "Spring Boot",
                      "location": null,
                      "jobType": null,
                      "experienceLevel": null,
                      "remote": null,
                      "minSalary": null,
                      "maxSalary": null
                    }

                    User:
                    What is ATS?

                    JSON:
                    {
                      "isJobSearch": false,
                      "keyword": null,
                      "location": null,
                      "jobType": null,
                      "experienceLevel": null,
                      "remote": null,
                      "minSalary": null,
                      "maxSalary": null
                    }

                    User message:
                    """ + userMessage;

            Map<String, Object> filterRequest = Map.of(

                    "model",
                    "openai/gpt-oss-120b",

                    "messages",
                    List.of(

                            Map.of(
                                    "role",
                                    "system",
                                    "content",
                                    "You extract structured job search filters."
                            ),

                            Map.of(
                                    "role",
                                    "user",
                                    "content",
                                    filterPrompt
                            )
                    ),

                    "temperature",
                    0
            );

            Map filterResponse = restClient.post()

                    .uri("/chat/completions")

                    .header(
                            "Authorization",
                            "Bearer " + apiKey
                    )

                    .contentType(
                            MediaType.APPLICATION_JSON
                    )

                    .body(filterRequest)

                    .retrieve()

                    .body(Map.class);

            /*
             * =====================================================
             * STEP 2: READ FILTER RESPONSE
             * =====================================================
             */

            String filterJson =
                    extractGroqContent(filterResponse);

            JsonNode filters =
                    objectMapper.readTree(filterJson);

            boolean isJobSearch =
                    filters.path("isJobSearch")
                            .asBoolean(false);

            /*
             * =====================================================
             * NORMAL CHAT
             * =====================================================
             */

            if (!isJobSearch) {

                String answer =
                        askGeneralQuestion(
                                userMessage,
                                apiKey
                        );

                return new ChatbotResult(
                        answer,
                        List.of()
                );
            }

            /*
             * =====================================================
             * STEP 3: EXTRACT SEARCH FILTERS
             * =====================================================
             */

            String keyword =
                    getNullableText(
                            filters,
                            "keyword"
                    );

            String location =
                    getNullableText(
                            filters,
                            "location"
                    );

            String jobType =
                    getNullableText(
                            filters,
                            "jobType"
                    );

            String experienceLevel =
                    getNullableText(
                            filters,
                            "experienceLevel"
                    );

            Boolean remote =
                    getNullableBoolean(
                            filters,
                            "remote"
                    );

            Double minSalary =
                    getNullableDouble(
                            filters,
                            "minSalary"
                    );

            Double maxSalary =
                    getNullableDouble(
                            filters,
                            "maxSalary"
                    );

            /*
             * =====================================================
             * STEP 4: SEARCH REAL HIRESHERE JOBS
             * =====================================================
             */

            List<JobResponse> matchingJobs =
                    jobService.searchJobs(
                            keyword,
                            location,
                            jobType,
                            experienceLevel,
                            remote,
                            minSalary,
                            maxSalary
                    );

            List<JobResponse> limitedJobs =
                    matchingJobs.stream()
                            .limit(10)
                            .toList();

            /*
             * =====================================================
             * STEP 5: BUILD REAL JOB CONTEXT
             * =====================================================
             */

            StringBuilder jobContext =
                    new StringBuilder();

            if (limitedJobs.isEmpty()) {

                jobContext.append(
                        "NO MATCHING ACTIVE JOBS WERE FOUND."
                );

            } else {

                jobContext.append(
                        "REAL ACTIVE JOBS FROM THE HIRESHERE DATABASE:\n\n"
                );

                for (JobResponse job : limitedJobs) {

                    jobContext.append(
                            "Job ID: "
                    ).append(job.getId());

                    jobContext.append(
                            "\nTitle: "
                    ).append(safe(job.getTitle()));

                    jobContext.append(
                            "\nCompany: "
                    ).append(safe(job.getCompanyName()));

                    jobContext.append(
                            "\nLocation: "
                    ).append(safe(job.getLocation()));

                    jobContext.append(
                            "\nJob Type: "
                    ).append(safe(job.getJobType()));

                    jobContext.append(
                            "\nExperience: "
                    ).append(safe(job.getExperienceLevel()));

                    jobContext.append(
                            "\nSkills: "
                    ).append(safe(job.getSkills()));

                    jobContext.append(
                            "\nSalary: "
                    ).append(
                            job.getSalary() != null
                                    ? job.getSalary()
                                    : "Not specified"
                    );

                    jobContext.append(
                            "\nRemote: "
                    ).append(
                            job.getRemote() != null
                                    ? job.getRemote()
                                    : "Not specified"
                    );

                    jobContext.append(
                            "\nApplication Deadline: "
                    ).append(
                            job.getApplicationDeadline() != null
                                    ? job.getApplicationDeadline()
                                    : "Not specified"
                    );

                    jobContext.append(
                            "\nStatus: "
                    ).append(safe(job.getStatus()));

                    jobContext.append(
                            "\nDescription: "
                    ).append(safe(job.getDescription()));

                    jobContext.append(
                            "\n--------------------------------\n"
                    );
                }
            }

            /*
             * =====================================================
             * STEP 6: ASK GROQ TO FORMAT THE REAL RESULTS
             * =====================================================
             */

            String answerPrompt = """
                    You are HireSphere AI, the official AI assistant
                    for the HireSphere job portal.

                    The user is searching for jobs.

                    Below is REAL job data retrieved directly from the
                    HireSphere database.

                    IMPORTANT RULES:

                    1. Only use the jobs provided below.
                    2. Never invent jobs.
                    3. Never invent companies.
                    4. Never invent salaries.
                    5. Never invent locations.
                    6. Never invent skills.
                    7. Never invent application deadlines.
                    8. Never claim a job exists unless it appears below.
                    9. If no jobs are provided, clearly say that no matching
                       active jobs were found.
                    10. Do not claim that you applied for a job.
                    11. Do not claim that you performed any action.
                    12. Keep the response concise and useful.
                    13. Do not create fake job IDs.

                    User request:
                    """ + userMessage + """

                    Real HireSphere job data:

                    """ + jobContext;

            Map<String, Object> answerRequest = Map.of(

                    "model",
                    "openai/gpt-oss-120b",

                    "messages",
                    List.of(

                            Map.of(
                                    "role",
                                    "system",
                                    "content",
                                    "You are the official HireSphere AI assistant."
                            ),

                            Map.of(
                                    "role",
                                    "user",
                                    "content",
                                    answerPrompt
                            )
                    ),

                    "temperature",
                    0.3
            );

            Map answerResponse =
                    restClient.post()

                            .uri("/chat/completions")

                            .header(
                                    "Authorization",
                                    "Bearer " + apiKey
                            )

                            .contentType(
                                    MediaType.APPLICATION_JSON
                            )

                            .body(answerRequest)

                            .retrieve()

                            .body(Map.class);

            String answer =
                    extractGroqContent(
                            answerResponse
                    );

            return new ChatbotResult(
                    answer,
                    limitedJobs
            );

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

            return new ChatbotResult(
                    "Sorry, I'm unable to respond right now.",
                    List.of()
            );
        }
    }

    /*
     * =============================================================
     * GENERAL AI QUESTION
     * =============================================================
     */

    private String askGeneralQuestion(
            String userMessage,
            String apiKey) {

        try {

            String systemPrompt = """
                    You are HireSphere AI, the official AI assistant
                    for the HireSphere job portal.

                    Help users understand and use HireSphere.

                    HireSphere allows job seekers to:
                    - Create an account
                    - Browse jobs
                    - View job details
                    - Apply for jobs
                    - Track applications
                    - Upload resumes
                    - Analyze resumes using ATS analysis
                    - Identify missing skills
                    - Receive career recommendations

                    HireSphere allows employers to:
                    - Create company profiles
                    - Create job postings
                    - Manage jobs
                    - View applications
                    - Manage candidates

                    Answer clearly and concisely.

                    Do not claim that you performed an action unless
                    the system actually provides that capability.

                    If the question is unrelated to HireSphere,
                    you may still provide a helpful general answer.
                    """;

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
                    0.5
            );

            Map response =
                    restClient.post()

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

            return extractGroqContent(response);

        } catch (Exception e) {

            System.out.println(
                    "GENERAL CHAT ERROR: "
                            + e.getMessage()
            );

            return "Sorry, I'm unable to respond right now.";
        }
    }

    /*
     * =============================================================
     * EXTRACT GROQ RESPONSE CONTENT
     * =============================================================
     */

    private String extractGroqContent(
            Map response) {

        if (response == null) {
            return "";
        }

        Object choicesObject =
                response.get("choices");

        if (!(choicesObject instanceof List<?> choices)
                || choices.isEmpty()) {

            return "";
        }

        Object choiceObject =
                choices.get(0);

        if (!(choiceObject instanceof Map<?, ?> choice)) {
            return "";
        }

        Object messageObject =
                choice.get("message");

        if (!(messageObject instanceof Map<?, ?> message)) {
            return "";
        }

        Object content =
                message.get("content");

        if (content == null) {
            return "";
        }

        return content.toString().trim();
    }

    /*
     * =============================================================
     * JSON HELPERS
     * =============================================================
     */

    private String getNullableText(
            JsonNode node,
            String field) {

        JsonNode value =
                node.get(field);

        if (value == null
                || value.isNull()
                || value.asText().isBlank()) {

            return null;
        }

        return value.asText().trim();
    }

    private Boolean getNullableBoolean(
            JsonNode node,
            String field) {

        JsonNode value =
                node.get(field);

        if (value == null
                || value.isNull()) {

            return null;
        }

        return value.asBoolean();
    }

    private Double getNullableDouble(
            JsonNode node,
            String field) {

        JsonNode value =
                node.get(field);

        if (value == null
                || value.isNull()) {

            return null;
        }

        if (value.isNumber()) {
            return value.asDouble();
        }

        try {

            return Double.parseDouble(
                    value.asText()
            );

        } catch (Exception e) {

            return null;
        }
    }

    private String safe(String value) {

        return value != null
                ? value
                : "Not specified";
    }

    /*
     * =============================================================
     * CHATBOT RESULT
     * =============================================================
     */

    public static class ChatbotResult {

        private final String response;
        private final List<JobResponse> jobs;

        public ChatbotResult(
                String response,
                List<JobResponse> jobs) {

            this.response = response;
            this.jobs = jobs;
        }

        public String getResponse() {
            return response;
        }

        public List<JobResponse> getJobs() {
            return jobs;
        }
    }
}