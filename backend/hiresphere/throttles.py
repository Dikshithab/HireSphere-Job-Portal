from rest_framework.throttling import UserRateThrottle


class AIRequestThrottle(UserRateThrottle):
    scope = "ai"