# Generated by Django 4.2.8 on 2023-12-26 14:04

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("music_rec_app", "0006_audiofeature_gmm_cluster_audiofeature_pca_x_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="Korea_top50_artist",
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
                "db_table": "KOREA_TOP50_ARTIST",
                "managed": True,
            },
        ),
        migrations.CreateModel(
            name="Korea_top50_track",
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
                        db_column="artist_id",
                        null=True,
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        to="music_rec_app.korea_top50_artist",
                    ),
                ),
            ],
            options={
                "db_table": "KOREA_TOP50_TRACK",
                "managed": True,
            },
        ),
        migrations.CreateModel(
            name="Korea_top50_audio",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("danceability", models.FloatField(blank=True, null=True)),
                ("energy", models.FloatField(blank=True, null=True)),
                ("loudness", models.FloatField(blank=True, null=True)),
                ("acousticness", models.FloatField(blank=True, null=True)),
                ("tempo", models.FloatField(blank=True, null=True)),
                (
                    "track_id",
                    models.ForeignKey(
                        blank=True,
                        db_column="track_id",
                        null=True,
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        to="music_rec_app.korea_top50_track",
                    ),
                ),
            ],
            options={
                "db_table": "KOREA_TOP50_AUDIO",
                "managed": True,
            },
        ),
    ]
