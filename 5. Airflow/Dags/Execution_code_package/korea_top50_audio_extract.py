from spotipy.oauth2 import SpotifyClientCredentials
import spotipy
from datetime import datetime
import pandas as pd


def get_spotify_korea_top50_audio(ti):
    
    client_id = "71a6172ac25b4574967c90eb0a36929b"
    client_secret = "f54ac611844c4d05a39f521208eaed84"

    client_credentials_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
    sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

    spotify_top50_data = ti.xcom_pull(task_ids=["spotify_top50_track_result"])
    result_df = pd.DataFrame(spotify_top50_data[0])

    track_id_list = result_df['track_id']

    data = {
        'track_id': [],
        'danceability': [],
        'energy': [],
        'loudness': [],
        'acousticness': [],
        'tempo': [],
    }

    for track_id in track_id_list:
        audio_features = sp.audio_features(track_id)
        if audio_features:
            data['track_id'].append(track_id)
            data['danceability'].append(audio_features[0]['danceability'])
            data['energy'].append(audio_features[0]['energy'])
            data['loudness'].append(audio_features[0]['loudness'])
            data['acousticness'].append(audio_features[0]['acousticness'])
            data['tempo'].append(audio_features[0]['tempo'])
        else:
            data['track_id'].append(None)
            data['danceability'].append(None)
            data['energy'].append(None)
            data['loudness'].append(None)
            data['acousticness'].append(None)
            data['tempo'].append(None)

    date = datetime.now().date()
    top50_df = pd.DataFrame(data)
    top50_df.to_csv(f'/home/ubuntu/airflow/save/top50_result/top50_audio_features_{date}.csv', index=False) 

    
    return data