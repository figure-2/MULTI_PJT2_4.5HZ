from django.db import models

class user_artist_agg(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey('accounts.User', models.DO_NOTHING, db_column='USER_ID')
    username= models.CharField(max_length=30, blank=True, null=True)
    artist_id = models.ForeignKey('music_rec_app.Artist', models.DO_NOTHING, db_column='ARTIST_ID', blank=True, null=True)  
    artist  = models.CharField(max_length=200)
    cnt = models.IntegerField(blank=True, null=True)  
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    
    class Meta:
        managed = True
        db_table = 'USER_ARTIST_AGG'
    
class user_track_agg(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey('accounts.User', models.DO_NOTHING, db_column='USER_ID',to_field='nickname')
    username= models.CharField(max_length=30, blank=True, null=True)
    track_id = models.ForeignKey('music_rec_app.Track', models.DO_NOTHING, db_column='TRACK_ID', blank=True, null=True)  
    track  = models.CharField(max_length=200)
    cnt = models.IntegerField(blank=True, null=True)  
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    
    class Meta:
        managed = True
        db_table = 'USER_TRACK_AGG'
    
class user_day_agg(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey('accounts.User', models.DO_NOTHING, db_column='USER_ID')
    username= models.CharField(max_length=30, blank=True, null=True)
    day_of_week = models.CharField(max_length=30, blank=True, null=True)
    cnt = models.IntegerField(blank=True, null=True)  
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    
    class Meta:
        managed = True
        db_table = 'USER_DAY_AGG'
        
class user_hour_agg(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey('accounts.User', models.DO_NOTHING, db_column='USER_ID')
    username= models.CharField(max_length=30, blank=True, null=True)
    hour = models.CharField(max_length=30, blank=True, null=True)
    cnt = models.IntegerField(blank=True, null=True)  
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    
    class Meta:
        managed = True
        db_table = 'USER_HOUR_AGG'
        
class user_genre_agg(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey('accounts.User', models.DO_NOTHING, db_column='USER_ID')
    username= models.CharField(max_length=30, blank=True, null=True)
    track_genre = models.CharField(max_length=30, blank=True, null=True)
    cnt = models.IntegerField(blank=True, null=True)  
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    
    class Meta:
        managed = True
        db_table = 'USER_GENRE_AGG'