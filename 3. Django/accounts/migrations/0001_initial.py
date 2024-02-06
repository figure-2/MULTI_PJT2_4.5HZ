# Generated by Django 4.2.8 on 2023-12-11 02:25

from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="User",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("password", models.CharField(max_length=128, verbose_name="password")),
                (
                    "last_login",
                    models.DateTimeField(
                        blank=True, null=True, verbose_name="last login"
                    ),
                ),
                (
                    "nickname",
                    models.CharField(
                        max_length=255, unique=True, verbose_name="nickname"
                    ),
                ),
                ("username", models.CharField(blank=True, max_length=30, null=True)),
                ("birth_date", models.DateField(blank=True, null=True)),
                ("gender", models.CharField(blank=True, max_length=10, null=True)),
                (
                    "liked_artist",
                    models.CharField(blank=True, max_length=200, null=True),
                ),
                (
                    "liked_track",
                    models.CharField(blank=True, max_length=200, null=True),
                ),
                ("is_active", models.BooleanField(default=True)),
                ("is_admin", models.BooleanField(default=False)),
            ],
            options={
                "db_table": "USERS",
                "managed": True,
            },
        ),
    ]