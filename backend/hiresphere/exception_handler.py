from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):

    response = exception_handler(exc, context)

    if response is not None:
        return Response(
            {
                "success": False,
                "error": response.data,
                "status_code": response.status_code
            },
            status=response.status_code
        )

    # Log the real unexpected exception
    logger.exception(
        "UNHANDLED API EXCEPTION: %s",
        exc,
        exc_info=True
    )

    return Response(
        {
            "success": False,
            "error": "An unexpected server error occurred.",
            "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR
    )