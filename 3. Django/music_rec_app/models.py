from django.db import models
from accounts.models import User

class Artist(models.Model):
    artist_id = models.CharField(primary_key=True, max_length=30)  
    artist_name = models.CharField(max_length=200)  
    popularity = models.IntegerField(blank=True, null=True)  
    followers = models.IntegerField(blank=True, null=True)  

    class Meta:
        managed = True
        db_table = 'ARTISTS'



class Track(models.Model):
    artist_id = models.ForeignKey('Artist', models.DO_NOTHING, db_column='ARTIST_ID', blank=True, null=True)  
    artist_name = models.CharField(max_length=200, blank=True, null=True)  
    track_id = models.CharField(primary_key=True, max_length=30)  
    track_name = models.CharField(max_length=200, blank=True, null=True)  
    release_date = models.DateField(blank=True, null=True)  
    track_popularity = models.IntegerField(blank=True, null=True)  
    track_picture_url = models.CharField(max_length=200, blank=True, null=True)  
    genres = models.CharField(max_length=80, blank=True, null=True)  

    class Meta:
        managed = True
        db_table = 'TRACKS'
        

class AudioFeature(models.Model):
    id = models.AutoField(primary_key=True)      
    danceability = models.FloatField(blank=True, null=True) 
    energy = models.FloatField(blank=True, null=True)  
    music_key = models.IntegerField(blank=True, null=True)   
    loudness = models.FloatField(blank=True, null=True)  
    music_mode = models.IntegerField(blank=True, null=True)  
    speechiness = models.FloatField(blank=True, null=True)  
    acousticness = models.FloatField(blank=True, null=True)  
    instrumentalness = models.FloatField(blank=True, null=True)  
    liveness = models.FloatField(blank=True, null=True)  
    valence = models.FloatField(blank=True, null=True)  
    tempo = models.FloatField(blank=True, null=True)  
    track_id = models.ForeignKey('Track', models.DO_NOTHING, db_column='TRACK_ID', blank=True, null=True)  
    duration_ms = models.IntegerField(blank=True, null=True)  
    time_signature = models.IntegerField(blank=True, null=True)  

    pca_x = models.FloatField(null=True, blank=True)
    pca_y = models.FloatField(null=True, blank=True)
    gmm_cluster = models.IntegerField(null=True, blank=True)
    
    class Meta:
        managed = True
        db_table = 'AUDIO_FEATURS'


class Playlist(models.Model):
    playlist_id = models.AutoField(primary_key=True)  
    user = models.ForeignKey('accounts.User', models.DO_NOTHING, db_column='USER_ID')  

    class Meta:
        managed = True
        db_table = 'PLAYLIST'


class PlaylistTrack(models.Model):
    playlist = models.ForeignKey(Playlist, models.DO_NOTHING, db_column='PLAYLIST_ID', blank=True, null=True)  
    track = models.ForeignKey('Track', models.DO_NOTHING, db_column='TRACK_ID', blank=True, null=True)  
    rating = models.IntegerField(blank=True, null=True)
    cnt = models.IntegerField(blank=True, null=True)
    
    class Meta:
        managed = True
        db_table = 'PLAYLIST_TRACK'

class Korea_top50_artist(models.Model):
    # id = models.AutoField(primary_key=True)
    artist_id = models.CharField(primary_key=True, max_length=30)  
    artist_name = models.CharField(max_length=200)  
    popularity = models.IntegerField(blank=True, null=True)  
    followers = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'KOREA_TOP50_ARTIST'
    
class Korea_top50_track(models.Model):
    # id = models.AutoField(primary_key=True)
    artist_id = models.ForeignKey('Korea_top50_artist', models.DO_NOTHING, db_column='artist_id', blank=True, null=True)  
    artist_name = models.CharField(max_length=200, blank=True, null=True)  
    track_id = models.CharField(primary_key=True, max_length=30)  
    track_name = models.CharField(max_length=200, blank=True, null=True)  
    release_date = models.DateField(blank=True, null=True)  
    track_popularity = models.IntegerField(blank=True, null=True)  
    track_picture_url = models.CharField(max_length=200, blank=True, null=True)  
    genres = models.CharField(max_length=80, blank=True, null=True)  
    rank = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'KOREA_TOP50_TRACK'
        
class Korea_top50_audio(models.Model):
    id = models.AutoField(primary_key=True)      
    track_id = models.ForeignKey('Korea_top50_track', models.DO_NOTHING, db_column='track_id', blank=True, null=True)  
    danceability = models.FloatField(blank=True, null=True) 
    energy = models.FloatField(blank=True, null=True)  
    loudness = models.FloatField(blank=True, null=True)  
    acousticness = models.FloatField(blank=True, null=True)   
    tempo = models.FloatField(blank=True, null=True)  
    
    class Meta:
        managed = True
        db_table = 'KOREA_TOP50_AUDIO'
