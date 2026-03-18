from django.core.management.base import BaseCommand
from apps.users.models import User
from apps.catalog.models import Category, Item
from apps.cart.models import Cart, CartItem


class Command(BaseCommand):
    help = "Seed test date for BD Shop"

    def handle(self, *args, **kwargs):
        # Создаем пользователей
        if not User.objects.filter(username="admin").exists():
            User.objects.create_superuser("admin", "admin@example.com", "admin")
            self.stdout.write(self.style.SUCCESS("Superuser 'admin' создан"))

        if not User.objects.filter(username="player1").exists():
            user = User.objects.create_user(
                "player1", "player1@example.com", "player123"
            )
            Cart.objects.create(user=user)
            self.stdout.write(self.style.SUCCESS("Пользователь 'player1' создан"))

        # Создаем категории
        weapons, _ = Category.objects.get_or_create(name="Weapons")
        armor, _ = Category.objects.get_or_create(name="Armor")
        self.stdout.write(self.style.SUCCESS("Категории созданы"))

        # Создаем товары
        Item.objects.get_or_create(
            name="Sword of Valor", category=weapons, price=1000, is_active=True
        )
        Item.objects.get_or_create(
            name="Shield of Light", category=armor, price=750, is_active=True
        )
        Item.objects.get_or_create(
            name="Helmet of Wisdom", category=armor, price=500, is_active=True
        )
        self.stdout.write(self.style.SUCCESS("Товары созданы"))
