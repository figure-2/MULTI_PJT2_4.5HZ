from spotipy.oauth2 import SpotifyClientCredentials
import spotipy
import pandas as pd
from datetime import datetime

def get_spotify_korea_top50_track():
        
    client_id = "71a6172ac25b4574967c90eb0a36929b"
    client_secret = "f54ac611844c4d05a39f521208eaed84"

    korea_top50_playlist_id = '37i9dQZEVXbNxXF4SkHj9F' # Top50 - 대한민국

    client_credentials_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
    sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

    playlist = sp.playlist(korea_top50_playlist_id)
    tracks = playlist['tracks']['items']

    data = {'artist_id' : [], 'artist_name': [], 'track_id' : [], 'track_name': [], 'track_picture_url': [], 'release_date': [],
            'track_popularity': [],'genres': [], 'rank':[] }
    rank = 0
    for track in tracks:
        rank += 1
        # 트랙의 정보 가져오기
        track_info = track['track']
        
        artists = ', '.join([artist['name'] for artist in track_info['artists']])
        artists_id = [artist['id'] for artist in track_info['artists']][0]  #', '.join([artist['id'] for artist in track_info['artists']])
        # print(artists_id)
        track_name = track_info['name']
        track_id = track_info['id']
        images_url = track_info['album']['images'][1]['url']
        
        track_details = sp.track(track_id)
        track_popularity = track_details['popularity']
        artist = sp.artist(track_info['artists'][0]['id'])
        track_genres = artist['genres'][0] if artist and artist['genres'] else None
        # print(track_genres)
        release_date = track_details['album']['release_date'] if 'release_date' in track_details['album'] else None
        if len(release_date) < 10:
            release_date += "-01-01"
        # print(len(release_date))
        data['artist_name'].append(artists)
        data['track_id'].append(track_id)
        data['track_name'].append(track_name)
        data['release_date'].append(release_date)
        data['track_popularity'].append(track_popularity)
        data['track_picture_url'].append(images_url)
        data['genres'].append(track_genres)
        data['artist_id'].append(artists_id)
        data['rank'].append(rank)

    date = datetime.now().date()
    top50_track_df = pd.DataFrame(data)
    # print(top50_track_df)
    top50_track_df.to_csv(f'/home/ubuntu/airflow/save/top50_result/top50_track_{date}.csv', index=False) 
    
    return data