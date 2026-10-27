import os
import urllib.request
import urllib.error

from groq import Groq
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status


class ChatbotView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        message = request.data.get("message", "").strip()

        if not message:
            return Response(
                {"error": "Message is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        api_key = os.getenv("GROQ_API_KEY")

        if not api_key:
            return Response(
                {"error": "GROQ_API_KEY is not configured."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # -------------------------------------------------
        # TEST 1: Can Render reach Groq?
        # -------------------------------------------------
        try:
            req = urllib.request.Request(
                "https://api.groq.com",
                headers={
                    "User-Agent": "HireSphere/1.0"
                }
            )

            with urllib.request.urlopen(req, timeout=15) as response:
                print(
                    "GROQ NETWORK TEST:",
                    response.status
                )

        except Exception as network_error:
            print(
                "GROQ NETWORK ERROR:",
                repr(network_error)
            )

            return Response(
                {
                    "error": "Render cannot connect to Groq.",
                    "details": str(network_error)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # -------------------------------------------------
        # TEST 2: Groq API request
        # -------------------------------------------------
        try:
            client = Groq(api_key=api_key)

            response = client.chat.completions.create(
                model="openai/gpt-oss-20b",
                messages=[
                    {
                        "role": "system",
                        "content": """
You are HireSphere's AI career assistant.

Help users with:
- Job searching
- Resume improvement
- ATS optimization
- Interview preparation
- Job applications
- Python, Java, React and Django
- Career guidance

Give clear, practical and concise answers.
"""
                    },
                    {
                        "role": "user",
                        "content": message
                    }
                ],
                temperature=0.3,
            )

            return Response({
                "reply": response.choices[0].message.content
            })

        except Exception as e:
            print(
                "GROQ API ERROR:",
                repr(e)
            )

            return Response(
                {
                    "error": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
