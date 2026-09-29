import os

from openai import OpenAI
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

        try:
            client = OpenAI(
                api_key=api_key,
                base_url="https://api.groq.com/openai/v1",
            )

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

            reply = response.choices[0].message.content

            return Response({
                "reply": reply
            })

        except Exception as e:
            print("CHATBOT ERROR:", repr(e))

            return Response(
                {
                    "error": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )