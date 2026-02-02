from django.db import models

# Create your models here.


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Item(models.Model):
    name = models.CharField(max_length=150)
    description = models.TextField()
    price = models.PositiveIntegerField(help_text="Price in silver")
    category = models.ForeignKey(
        Category, related_name="items", on_delete=models.CASCADE
    )
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name
