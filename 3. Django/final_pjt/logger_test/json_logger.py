import logging 
from music_rec_app.models import Track
from django.conf import settings
from kafka import KafkaProducer
from kafka.errors import KafkaError
import json
from datetime import datetime

def onclick_logger_test(callback):
    logger = logging.getLogger("onclick")
    
    def wrapper(request, track_id, *args, **kwargs):
        
        # producer = KafkaProducer(bootstrap_servers="172.31.15.209:9092", value_serializer=lambda v: json.dumps(v).encode('utf-8'))
        user_id = request.user.nickname
        username = request.user.username
        gender = request.user.gender
        birth_date = request.user.birth_date
        url = request.path

        # track_id에 해당하는 트랙 가져오기
        track = Track.objects.get(track_id=track_id)

        # track에서 track_name과 artist_name 가져오기
        track_name = track.track_name
        artist_name = track.artist_name
        
        track_genre = track.genres
        track_id = track.track_id
        artist_id = track.artist_id.artist_id
        track_picture_url = track.track_picture_url

        log_message = {
            'user_id': user_id, 
            'gender' : gender, 
            'username': username, 
            'birth_date' : birth_date,
            'url': url,
            'method': request.method,
            'track': track_name,
            'artist': artist_name,
            'track_id': track_id,
            'artist_id': artist_id,
            'track_genre' : track_genre
        }
        
        log_message2 = {
            'user_id': user_id, 
            'gender' : gender, 
            'username': username, 
            'track': track_name,
            'artist': artist_name,
            'track_id': track_id,
            'artist_id': artist_id,
            'track_genre' : track_genre,
            'track_picture_url' : track_picture_url,
            'time' : datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

        logger.debug("onclick", extra=log_message)
        # producer.send('log_topic', value=log_message2) # .encoding('utf-8')
        
        try:
            producer = KafkaProducer(bootstrap_servers="172.31.15.209:9092", value_serializer=lambda v: json.dumps(v).encode('utf-8'))
            producer.send('log_topic', value=log_message2)
        except KafkaError as e:
            print(f"Failed to send log: {e}")
        
        return callback(request, track_id, *args, **kwargs)

    return wrapper
