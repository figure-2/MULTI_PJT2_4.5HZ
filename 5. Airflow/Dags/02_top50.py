from datetime import datetime
from airflow import DAG

from airflow.providers.mysql.operators.mysql import MySqlOperator
from airflow.operators.python import PythonOperator

from my_package.korea_top50_track_extract import get_spotify_korea_top50_track
from my_package.korea_top50_artist_extract import get_spotify_korea_top50_artist
from my_package.korea_top50_audio_extract import get_spotify_korea_top50_audio
from my_package.save import top50_result_in_mysql

default_args = {
    "start_date" : datetime(2023, 12, 21)
}

with DAG(
    dag_id = "spotify-top50-pipeline",
    schedule_interval = "0 10 * * *", # @hourly
    default_args = default_args,
    tags = ["spotify","top50"],
    catchup = False
) as dag:
    
    # 1. top50 데이터 수집
    spotify_top50_track_result = PythonOperator(
        task_id = "spotify_top50_track_result",
        python_callable=get_spotify_korea_top50_track
    ) 

    # 2. top50 아티스트 데이터 수집
    spotify_top50_artist_result = PythonOperator(
        task_id = "spotify_top50_artist_result",
        python_callable=get_spotify_korea_top50_artist
    )

    # 3. top50 audio-features 데이터 수집
    spotify_top50_audio_result = PythonOperator(
        task_id = "spotify_top50_audio_result",
        python_callable=get_spotify_korea_top50_audio
    )
    # 4. DB 적재
    top50_result_in_mysql_result = PythonOperator(
        task_id='top50_result_in_mysql_result',
        python_callable=top50_result_in_mysql
    )
    
    spotify_top50_track_result >> spotify_top50_artist_result >> spotify_top50_audio_result >> top50_result_in_mysql_result

    
    