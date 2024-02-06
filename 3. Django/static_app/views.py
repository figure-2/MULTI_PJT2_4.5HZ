from django.shortcuts import render
from .models import user_artist_agg,user_track_agg,user_day_agg, user_hour_agg, user_genre_agg

def show_static(request):
    return render(request, 'static_home.html')

def show_personal_static(request):

    username = request.user.username

    artist_agg = user_artist_agg.objects.filter(username=username)
    track_agg = user_track_agg.objects.filter(username=username)
    day_agg = user_day_agg.objects.filter(username=username)
    hour_agg = user_hour_agg.objects.filter(username=username)
    genre_agg = user_genre_agg.objects.filter(username=username)
                
    context = {
        'artist_agg': artist_agg,
        'track_agg' : track_agg,
        'day_agg' : day_agg,
        'username' : username,
        'hour_agg' : hour_agg,
        'genre_agg' : genre_agg,
    }
    

    return render(request, 'personal_static.html', context) # {'token':token}

