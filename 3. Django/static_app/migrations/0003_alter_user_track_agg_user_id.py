# Generated by Django 4.2.8 on 2023-12-20 10:52

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("static_app", "0002_user_hour_agg_user_genre_agg"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user_track_agg",
            name="user_id",
            field=models.ForeignKey(
                db_column="USER_ID",
                on_delete=django.db.models.deletion.DO_NOTHING,
                to=settings.AUTH_USER_MODEL,
                to_field="nickname",
            ),
        ),
    ]