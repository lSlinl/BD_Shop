from rest_framework import serializers
from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ("username", "email", "password")

    def validate_username(self, value):
        if len(value) < 2:
            raise serializers.ValidationError(
                "Имя пользователя должно содержать минимум 2 символа"
            )
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Пользователь с таким e-mail уже существует"
            )
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "address",
            "role",
            "avatar",
            "date_joined",
        ]
        read_only_fields = ["id", "username", "email", "date_joined", "role"]

    def validate_phone(self, value):
        if value and not value.replace("+", "").replace("-", "").isdigit():
            raise serializers.ValidationError("Неверный формат телефона")
        return value


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["first_name", "last_name", "address"]
