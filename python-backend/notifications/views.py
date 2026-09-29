from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import Notification


class NotificationListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        notifications = Notification.objects.filter(
            user=request.user
        )

        data = []

        for notification in notifications:

            data.append({
                "id": notification.id,
                "notification_type": notification.notification_type,
                "title": notification.title,
                "message": notification.message,
                "job_id": notification.job.id if notification.job else None,
                "application_id": notification.application_id,
                "is_read": notification.is_read,
                "created_at": notification.created_at,
            })

        return Response(
            data,
            status=status.HTTP_200_OK
        )


class UnreadNotificationCountView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        count = Notification.objects.filter(
            user=request.user,
            is_read=False
        ).count()

        return Response(
            {
                "unread_count": count
            },
            status=status.HTTP_200_OK
        )


class MarkNotificationReadView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request, notification_id):

        try:
            notification = Notification.objects.get(
                id=notification_id,
                user=request.user
            )

        except Notification.DoesNotExist:

            return Response(
                {
                    "message": "Notification not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        notification.is_read = True
        notification.save()

        return Response(
            {
                "message": "Notification marked as read",
                "is_read": True
            },
            status=status.HTTP_200_OK
        )


class MarkAllNotificationsReadView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request):

        updated = Notification.objects.filter(
            user=request.user,
            is_read=False
        ).update(
            is_read=True
        )

        return Response(
            {
                "message": "All notifications marked as read",
                "updated_count": updated
            },
            status=status.HTTP_200_OK
        )