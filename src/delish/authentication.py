from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import MyTokenObtainPairSerializer, UserSerializer


# Customised TokenObtainPairView class with added "username"
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(["POST"])
def login(request):
    serializer = MyTokenObtainPairSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user_serializer = UserSerializer(serializer.user)

    # Build a response with the access token and user data.
    response = Response(
        {
            "access": serializer.validated_data["access"],
            "user": user_serializer.data,
        },
        status=status.HTTP_200_OK,
    )

    # Get the refresh token from the serializer
    refresh_token = serializer.validated_data["refresh"]

    # Set the refresh token in an http‑only cookie.
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,  # use secure=True in production (requires HTTPS)
        samesite="Lax",  # or 'Lax' based on your requirements
        max_age=30 * 24 * 3600,
    )

    return response


@api_view(["POST"])
def logout(request):
    response = Response(
        {"detail": "Logged out successfully."}, status=status.HTTP_200_OK
    )
    response.delete_cookie("refresh_token")
    return response


@api_view(["POST"])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        user.set_password(request.data["password"])
        user.save()
        refresh = RefreshToken.for_user(user)

        response = Response(
            {
                "access": str(refresh.access_token),
                "user": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )
        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,  # Prevents JS access to the cookie
            secure=False,  # Use HTTPS in production
            samesite="Lax",  # Adjust based on your requirements
            max_age=30 * 24 * 3600,  # 30 days in seconds
        )
        return response

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def refresh_token(request):
    refresh_token = request.COOKIES.get("refresh_token")
    if not refresh_token:
        return Response(
            {"error": "Refresh token not found"}, status=status.HTTP_401_UNAUTHORIZED
        )

    try:
        # Validate the refresh token
        token = RefreshToken(refresh_token)
        # Create a new access token
        new_access_token = str(token.access_token)

        return Response(
            {"access": new_access_token},
            status=status.HTTP_200_OK,
        )

    except InvalidToken:
        return Response(
            {"error": "Expired or invalid refresh token"},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    except TokenError:
        return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
