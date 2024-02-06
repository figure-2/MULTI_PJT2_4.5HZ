# Generated by Django 4.2.8 on 2023-12-11 02:25

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Artist",
            fields=[
                (
                    "artist_id",
                    models.CharField(max_length=30, primary_key=True, serialize=False),
                ),
                ("artist_name", models.CharField(max_length=200)),
                ("popularity", models.IntegerField(blank=True, null=True)),
                ("followers", models.IntegerField(blank=True, null=True)),
            ],
            options={
                "db_table": "ARTISTS",
                "managed": True,
            },
        ),
        migrations.CreateModel(
            name="Playlist",
            fields=[
                ("playlist_id", models.AutoField(primary_key=True, serialize=False)),
                (
                    "user",
                    models.ForeignKey(
                        db_column="USER_ID",
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "db_table": "PLAYLIST",
                "managed": True,
            },
        ),
        migrations.CreateModel(
            name="Track",
            fields=[
                (
                    "artist_name",
                    models.CharField(blank=True, max_length=200, null=True),
                ),
                (
                    "track_id",
                    models.CharField(max_length=30, primary_key=True, serialize=False),
                ),
                ("track_name", models.CharField(blank=True, max_length=200, null=True)),
                ("release_date", models.DateField(blank=True, null=True)),
                ("track_popularity", models.IntegerField(blank=True, null=True)),
                (
                    "track_picture_url",
                    models.CharField(blank=True, max_length=200, null=True),
                ),
                ("genres", models.CharField(blank=True, max_length=80, null=True)),
                (
                    "artist_id",
                    models.ForeignKey(
                        blank=True,
                        db_column="ARTIST_ID",
                        null=True,
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        to="music_rec_app.artist",
                    ),
                ),
            ],
            options={
                "db_table": "TRACKS",
                "managed": True,
            },
        ),
        migrations.CreateModel(
            name="PlaylistTrack",
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
                (
                    "playlist",
                    models.ForeignKey(
                        blank=True,
                        db_column="PLAYLIST_ID",
                        null=True,
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        to="music_rec_app.playlist",
                    ),
                ),
                (
                    "track",
                    models.ForeignKey(
                        blank=True,
                        db_column="TRACK_ID",
                        null=True,
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        to="music_rec_app.track",
                    ),
                ),
            ],
            options={
                "db_table": "PLAYLIST_TRACK",
                "managed": True,
            },
        ),
        migrations.CreateModel(
            name="AudioFeature",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("danceability", models.FloatField(blank=True, null=True)),
                ("energy", models.FloatField(blank=True, null=True)),
                ("music_key", models.IntegerField(blank=True, null=True)),
                ("loudness", models.FloatField(blank=True, null=True)),
                ("music_mode", models.IntegerField(blank=True, null=True)),
                ("speechiness", models.FloatField(blank=True, null=True)),
                ("acousticness", models.FloatField(blank=True, null=True)),
                ("insrumentalness", models.FloatField(blank=True, null=True)),
                ("liveness", models.FloatField(blank=True, null=True)),
                ("valence", models.FloatField(blank=True, null=True)),
                ("tempo", models.FloatField(blank=True, null=True)),
                ("duration_ms", models.IntegerField(blank=True, null=True)),
                ("time_signature", models.IntegerField(blank=True, null=True)),
                (
                    "track_id",
                    models.ForeignKey(
                        blank=True,
                        db_column="TRACK_ID",
                        null=True,
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        to="music_rec_app.track",
                    ),
                ),
            ],
            options={
                "db_table": "AUDIO_FEATURS",
                "managed": True,
            },
        ),
    ]