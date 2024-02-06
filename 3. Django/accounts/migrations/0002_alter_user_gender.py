# Generated by Django 4.2.8 on 2023-12-11 07:19

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="gender",
            field=models.CharField(
                blank=True, choices=[("여", "여자"), ("남", "남자")], max_length=10, null=True
            ),
        ),
    ]
