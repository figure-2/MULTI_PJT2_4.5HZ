from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser


class UserManager(BaseUserManager) :
    
    def create_user(self, nickname, username, password=None): #, birth_date, gender, liked_artist, liked_track
        if not nickname:
            raise ValueError("Users must have an nickname")

        user = self.model(
            nickname = nickname,
            username = username,
            # password = password
            # birth_date = birth_date,
            # gender = gender,
            # liked_artist = liked_artist,
            # liked_track = liked_track
            )
        
        user.set_password(password)
        user.save(using=self._db) 
        return user
        
    def create_superuser(self, nickname, username, password): # , birth_date, gender, liked_artist, liked_track, 
        
        user = self.create_user(
            nickname, 
            username = username, 
            # birth_date = birth_date,
            # gender = gender,
            # liked_artist = liked_artist,
            # liked_track = liked_track,
            password = password
        )
        
        user.is_admin = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    nickname = models.CharField(
        verbose_name='nickname',
        max_length=255,
        unique=True,
    )
    
    username = models.CharField(max_length=30, blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    gender_choices = (("여자","여자"),("남자","남자"))
    gender = models.CharField( max_length=10, blank=True, null=True, choices=gender_choices)
    liked_artist = models.CharField(max_length=200, blank=True, null=True)
    liked_track = models.CharField(max_length=200, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    #recommended_tracks = models.ManyToManyField('music_rec_app.Track', related_name='recommended_users')
    #recommended_tracks = models.ManyToManyField('Track', related_name='recommended_users') # 음악 추천을 위해 미리 저장

    objects = UserManager()

    USERNAME_FIELD = 'nickname'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.nickname

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.is_admin
    
    class Meta:
        managed = True
        db_table = 'USERS'

    
