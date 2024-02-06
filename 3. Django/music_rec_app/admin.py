from django.contrib import admin

# Register your models here.
from .models import Artist
admin.site.register(Artist)

from .models import Track
admin.site.register(Track)

from .models import AudioFeature
admin.site.register(AudioFeature)

from .models import Playlist
admin.site.register(Playlist)

from .models import PlaylistTrack
admin.site.register(PlaylistTrack)