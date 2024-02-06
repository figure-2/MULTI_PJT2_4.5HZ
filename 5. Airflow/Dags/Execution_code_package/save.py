import pandas as pd
from datetime import datetime, timedelta
# from airflow.providers.mysql.operators.mysql import MySqlHook
from airflow.providers.common.sql.hooks.sql import DbApiHook
from sqlalchemy import create_engine
from datetime import datetime
import pickle


def read_csv_and_store_in_mysql():

    start_date = datetime.now().date() - timedelta(days=7)
    end_date = datetime.now().date() - timedelta(days=1)
    
    artist_df = pd.read_csv(f"/home/ubuntu/airflow/save/aggregate_result/artist_agg_{start_date}_{end_date}.csv")
    track_df = pd.read_csv(f"/home/ubuntu/airflow/save/aggregate_result/track_agg_{start_date}_{end_date}.csv")
    day_df = pd.read_csv(f"/home/ubuntu/airflow/save/aggregate_result/day_agg_{start_date}_{end_date}.csv")
    hour_df = pd.read_csv(f"/home/ubuntu/airflow/save/aggregate_result/hour_agg_{start_date}_{end_date}.csv")
    genre_df = pd.read_csv(f"/home/ubuntu/airflow/save/aggregate_result/genre_agg_{start_date}_{end_date}.csv")

    connection=DbApiHook.get_connection('mysql_db')
    database_username=connection.login
    database_password=connection.password
    database_ip = connection.host
    database_port = connection.port
    database_name = connection.schema

    database_connection = f"mysql+pymysql://{database_username}:{database_password}@{database_ip}:{database_port}/{database_name}"

    engine = create_engine(database_connection)

    track_df.to_sql(con=engine, name='USER_TRACK_AGG', if_exists='replace',index_label='id')
    artist_df.to_sql(con=engine, name='USER_ARTIST_AGG', if_exists='replace',index_label='id')
    day_df.to_sql(con=engine, name='USER_DAY_AGG', if_exists='replace',index_label='id')
    hour_df.to_sql(con=engine, name='USER_HOUR_AGG', if_exists='replace',index_label='id')
    genre_df.to_sql(con=engine, name='USER_GENRE_AGG', if_exists='replace',index_label='id')

# Top50 데이터 DB 적재
def top50_result_in_mysql():

    date = datetime.now().date()

    top50_track_df = pd.read_csv(f"/home/ubuntu/airflow/save/top50_result/top50_track_{date}.csv")
    top50_track_no_rank_df = top50_track_df.iloc[:, :-1]
    top50_artist_df = pd.read_csv(f"/home/ubuntu/airflow/save/top50_result/top50_artist_{date}.csv")
    top50_audio_df = pd.read_csv(f"/home/ubuntu/airflow/save/top50_result/top50_audio_features_{date}.csv")


    connection=DbApiHook.get_connection('mysql_db') # mysql_airflow_db
    database_username=connection.login
    database_password=connection.password
    database_ip = connection.host
    database_port = connection.port
    database_name = connection.schema

    database_connection = f"mysql+pymysql://{database_username}:{database_password}@{database_ip}:{database_port}/{database_name}"

    engine = create_engine(database_connection)

    existing_artist_ids = pd.read_sql('SELECT artist_id FROM ARTISTS', engine)['artist_id'].tolist()
    filtered_artist_df = top50_artist_df[~top50_artist_df['artist_id'].isin(existing_artist_ids)]
    # print(filtered_artist_df)
    filtered_artist_df.to_sql(con=engine, name='ARTISTS', if_exists='append', index=False)
        
    existing_track_ids = pd.read_sql('SELECT track_id FROM TRACKS', engine)['track_id'].tolist()
    filtered_track_df = top50_track_no_rank_df[~top50_track_no_rank_df['track_id'].isin(existing_track_ids)]
    # print(filtered_track_df)
    filtered_track_df.to_sql(con=engine, name='TRACKS', if_exists='append', index=False)
        
    existing_audio_ids = pd.read_sql('SELECT track_id FROM AUDIO_FEATURS', engine)['track_id'].tolist()
    filtered_audio_df = top50_audio_df[~top50_audio_df['track_id'].isin(existing_audio_ids)]
    # print(filtered_audio_df)
    filtered_audio_df.to_sql(con=engine, name='AUDIO_FEATURS', if_exists='append', index=False)
    
    with engine.connect() as connection:
        connection.execute('DELETE FROM KOREA_TOP50_AUDIO')
        connection.execute('DELETE FROM KOREA_TOP50_TRACK')
        connection.execute('DELETE FROM KOREA_TOP50_ARTIST')

    top50_artist_df.to_sql(con=engine, name='KOREA_TOP50_ARTIST', if_exists='append', index=False)
    top50_track_df.to_sql(con=engine, name='KOREA_TOP50_TRACK', if_exists='append', index=False)
    top50_audio_df.to_sql(con=engine, name='KOREA_TOP50_AUDIO', if_exists='append', index=False)
