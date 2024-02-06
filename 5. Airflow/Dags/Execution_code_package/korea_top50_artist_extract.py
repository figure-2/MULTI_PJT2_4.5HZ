from spotipy.oauth2 import SpotifyClientCredentials
import spotipy
from datetime import datetime
import pandas as pd

def get_spotify_korea_top50_artist(ti):
    
    spotify_top50_data = ti.xcom_pull(task_ids=["spotify_top50_track_result"])
    
    result_df = pd.DataFrame(spotify_top50_data[0])
    
    artist_id_list = result_df['artist_id']

    split_data = []
    
    for item in artist_id_list:
        split_values = item.split(', ')
        split_data.extend(split_values)

    client_id = "71a6172ac25b4574967c90eb0a36929b"
    client_secret = "f54ac611844c4d05a39f521208eaed84"

    client_credentials_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
    sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

    data = {'artist_id': [], 'artist_name': [], 'popularity': [], 'followers': []}

    for artist_id in split_data:
        artist_result = sp.artist(artist_id)
        if artist_result:
            artist_id = artist_result['id']
            artist_name = artist_result['name']
            popularity = artist_result['popularity']
            followers = artist_result['followers']['total']

            # 데이터 저장
            data['artist_id'].append(artist_id)
            data['artist_name'].append(artist_name)
            data['popularity'].append(popularity)
            data['followers'].append(followers)

        else:
            # Artist 정보가 없는 경우에 대한 처리
            data['artist_id'].append(None)
            data['artist_name'].append(None)
            data['popularity'].append(None)
            data['followers'].append(None)
            
    date = datetime.now().date()
    top50_artist_df = pd.DataFrame(data)
    
    top50_artist_df = top50_artist_df.drop_duplicates(subset='artist_id')
    
    top50_artist_df.to_csv(f'/home/ubuntu/airflow/save/top50_result/top50_artist_{date}.csv', index=False)
            
    return top50_artist_df
