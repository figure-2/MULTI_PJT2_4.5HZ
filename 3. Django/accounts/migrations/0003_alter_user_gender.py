# Generated by Django 4.2.8 on 2023-12-29 12:08

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0002_alter_user_gender"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="gender",
            field=models.CharField(
                blank=True,
                choices=[("여자", "여자"), ("남자", "남자")],
                max_length=10,
                null=True,
            ),
        ),
    ]
