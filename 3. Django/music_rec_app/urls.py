from django.urls import path
from . import views
from . import Collaborative_Filtering
from django.urls import include

# from .views import play_song

app_name = 'music_rec_app'

urlpatterns = [
    path('',views.index, name='index'),
    path('main/', views.main, name='main'),
    path('music/', views.music, name='music'),
    path('<str:track_id>/detail/', views.detail, name='detail'),
    path('detail/<str:playlist_id>/', views.playlist_detail, name='playlist_detail'),
    path('<str:track_id>/add_to_playlist/', views.add_to_playlist, name='add_to_playlist'),
    path('<str:track_id>/remove_from_playlist/', views.remove_from_playlist, name='remove_from_playlist'),

    path('recommend/<int:user_id>/', views.recommend_music, name='recommend_music'),
    path('recommend_music_2/<int:user_id>/', views.recommend_music_2, name='recommend_music_2'),
    path('search/', views.searchResult, name='search'),
    path('search_genre/', views.music_search, name='search_genre'),
    path('popup/<str:track_id>', views.popup, name='popup'),

]
