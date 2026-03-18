from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


class User(AbstractUser):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=11, blank=True, verbose_name="Телефон")
    avatar = models.ImageField(upload_to="avatar/", null=True, blank=True)
    ROLE_CHOICES = [("user", "Пользователь"), ("admin", "Администратор")]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="user")
    address = models.CharField(
        verbose_name="Адрес", max_length=50, null=True, blank=True
    )
    is_staff = models.BooleanField(default=False)

    @property
    def is_admin(self):
        return self.role == "admin" or self.is_staff

    def save(self, *args, **kwargs):
        if self.is_superuser or self.is_staff:
            self.role = "admin"
        elif self.role == "admin" and not self.is_staff:
            self.is_staff = True
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.username} | {self.email} | {self.is_superuser}"
