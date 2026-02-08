from django.contrib import admin
from .models import Category, Item


# Register your models here.
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "slug")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "category", "price", "is_active", "created_at")
    list_filter = ("is_active", "category")
    search_fields = ("name", "description")
