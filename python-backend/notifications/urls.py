from django.urls import path

from .views import (
    NotificationListView,
    UnreadNotificationCountView,
    MarkNotificationReadView,
    MarkAllNotificationsReadView,
)


urlpatterns = [

    path(
        "",
        NotificationListView.as_view(),
        name="notifications"
    ),

    path(
        "unread-count/",
        UnreadNotificationCountView.as_view(),
        name="notification-unread-count"
    ),

    path(
        "<int:notification_id>/read/",
        MarkNotificationReadView.as_view(),
        name="notification-read"
    ),

    path(
        "read-all/",
        MarkAllNotificationsReadView.as_view(),
        name="notification-read-all"
    ),

]