import pandas as pd
import pickle
import random
from airflow.providers.mysql.hooks.mysql import MySqlHook
from surprise import Dataset, Reader
from datetime import datetime 

def recommend_music():
    # MySQL 연결 설정
    mysql_hook = MySqlHook(mysql_conn_id='mysql_db')
    connection = mysql_hook.get_conn()
    cursor = connection.cursor()

    # 플레이리스트 트랙 데이터 로딩
    query = "SELECT * FROM PLAYLIST_TRACK ORDER BY PLAYLIST_ID ASC;"
    cursor.execute(query)
    result = cursor.fetchall()
    cursor.close()  

    # 데이터프레임 생성
    df = pd.DataFrame(result, columns=['id','PLAYLIST_ID', 'TRACK_ID', 'cnt', 'rating'])

    # User 테이블 데이터 로딩
    query = "SELECT id, username FROM USERS ORDER BY id ASC;"
    cursor.execute(query)
    result = cursor.fetchall()
    cursor.close()  # cursor 닫기

    # User 데이터프레임 생성
    df_user = pd.DataFrame(result, columns=['USER_ID','username'])

    # 사전 학습된 모델 불러오기
    loaded_model = pickle.load(open('/home/ubuntu/airflow/dags/recommend/Collaborative_Filtering_model.pkl', 'rb'))

    # 모든 사용자에 대해 음악 추천
    batch_size = 10
    counter = 0

    for i in range(0, len(df_user), batch_size):
        batch_users = df_user.iloc[i:i+batch_size]
    
        # 배치 사용자에 대한 처리를 수행
        for index, row in batch_users.iterrows():
            user_id = row['USER_ID']
            username = row['username']
            counter += 1

            # 사용자의 플레이리스트와 평점 조회
            user_tracks = df[df['TRACK_ID'] == user_id][['TRACK_ID', 'rating']]

            # 모든 트랙에 대한 예측 수행
            all_tracks = df['TRACK_ID'].unique()
            predictions = [loaded_model.predict(user_id, track_id) for track_id in all_tracks]

            # 예측 점수에 따라 정렬하여 상위 20곡 추천
            predictions.sort(key=lambda prediction: prediction.est, reverse=True)
            top_20_recommendations = [(prediction.iid, prediction.est) for prediction in predictions[:20]]

            # 상위 20곡 중 무작위로 5곡 선택
            random_selection = random.sample(top_20_recommendations, 5)

            # 최종 추천 곡 출력 및 저장
            for track_id_1, est_rating in random_selection:
                now = datetime.now() 
                formatted_date = now.strftime('%Y-%m-%d %H:%M:%S')  
                insert_query = f"INSERT INTO MUSIC_RECOMMEND_1 (TRACK_ID, USER_ID, created_at) VALUES ('{track_id_1}', {user_id}, '{formatted_date}');"  
                cursor.execute(insert_query)
                connection.commit()  # MySQL에 변경사항 저장
                cursor.close()  # cursor 닫기
            
            # 메모리 관리
            del user_tracks, all_tracks, predictions, top_20_recommendations, random_selection

    # 메모리 관리
    del df, df_user, loaded_model, result



# import pandas as pd
# import pickle
# import random
# from airflow import DAG
# from airflow.operators.python import PythonOperator
# from airflow.providers.mysql.hooks.mysql import MySqlHook
# from datetime import datetime, timedelta
# from surprise import Dataset, Reader
# from datetime import datetime 

# # MySQL 연결 설정
# mysql_hook = MySqlHook(mysql_conn_id='mysql_db')
# connection = mysql_hook.get_conn()
# cursor = connection.cursor()

# # 플레이리스트 트랙 데이터 로딩
# #query = "SELECT * FROM PLAYLIST_TRACK;"
# query = "SELECT * FROM PLAYLIST_TRACK ORDER BY PLAYLIST_ID ASC;"
# cursor.execute(query)
# result = cursor.fetchall()

# # 데이터프레임 생성
# df = pd.DataFrame(result, columns=['id','PLAYLIST_ID', 'TRACK_ID', 'cnt', 'rating'])

# # 플레이리스트 트랙 데이터 출력
# print(df.head())

# # User 테이블 데이터 로딩
# #query = "SELECT id, username FROM USERS;"
# #query = "SELECT id, username FROM USERS WHERE id IN (1, 2, 3, 4, 5);"
# query = "SELECT id, username FROM USERS ORDER BY id ASC;"
# cursor.execute(query)
# result = cursor.fetchall()

# # User 데이터프레임 생성
# df_user = pd.DataFrame(result, columns=['USER_ID','username'])

# # User 데이터 출력
# print(df_user.head())

# # 사전 학습된 모델 불러오기
# loaded_model = pickle.load(open('/home/ubuntu/airflow/dags/recommend/Collaborative_Filtering_model.pkl', 'rb'))

# # 모든 사용자에 대해 음악 추천
# batch_size = 10  # 적절한 배치 크기를 설정합니다.
# counter = 0  

# for i in range(0, len(df_user), batch_size):
#     batch_users = df_user.iloc[i:i+batch_size]

#     print(batch_users) 
    
#     # 배치 사용자에 대한 처리를 수행
#     for index, row in batch_users.iterrows():
#         user_id = row['USER_ID']
#         username = row['username']
#         counter += 1
#         # 사용자의 플레이리스트와 평점 조회
#         user_tracks = df[df['TRACK_ID'] == user_id][['TRACK_ID', 'rating']]

#         # 모든 트랙에 대한 예측 수행
#         all_tracks = df['TRACK_ID'].unique()
#         predictions = [loaded_model.predict(user_id, track_id) for track_id in all_tracks]

#         # 예측 점수에 따라 정렬하여 상위 20곡 추천
#         predictions.sort(key=lambda prediction: prediction.est, reverse=True)
#         top_20_recommendations = [(prediction.iid, prediction.est) for prediction in predictions[:20]]

#         # 상위 20곡 중 무작위로 5곡 선택
#         random_selection = random.sample(top_20_recommendations, 5)

#         # 최종 추천 곡 출력 및 저장
#         print(f"\n {username}님에게 추천하는 음악_1_{counter}")
#         for track_id_1, est_rating in random_selection:
#             print(f"Track ID: {track_id_1}, 예상 평점: {est_rating}")

#             now = datetime.now() 
#             formatted_date = now.strftime('%Y-%m-%d %H:%M:%S')  
#             insert_query = f"INSERT INTO MUSIC_RECOMMEND_1 (TRACK_ID, USER_ID, created_at) VALUES ('{track_id_1}', {user_id}, '{formatted_date}');"  
#             cursor.execute(insert_query)
                                   
#             # MySQL에 변경사항 저장
#             connection.commit()
        
            
#         # 메모리 관리
#         del user_tracks, all_tracks, predictions, top_20_recommendations, random_selection

# # 메모리 관리
# del df, df_user, loaded_model, result
