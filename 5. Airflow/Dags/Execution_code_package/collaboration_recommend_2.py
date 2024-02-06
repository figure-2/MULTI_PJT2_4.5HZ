import pandas as pd
import numpy as np
from tensorflow.keras.models import load_model
from datetime import datetime
from airflow.providers.mysql.hooks.mysql import MySqlHook

def recommend_music_2():
    # MySQL 연결 설정
    mysql_hook = MySqlHook(mysql_conn_id='mysql_db')
    connection = mysql_hook.get_conn()
    cursor = connection.cursor()

    # USERS 정보 가져오기
    query = "SELECT id, username, nickname, birth_date, gender FROM USERS ORDER BY id ASC;"
    cursor.execute(query)
    result = cursor.fetchall()
    df1 = pd.DataFrame(result, columns=['id', 'username', 'nickname', 'birth_date', 'gender'])

    # Playlist 정보 가져오기
    query = "SELECT * FROM PLAYLIST ORDER BY playlist_id ASC;"
    cursor.execute(query)
    result = cursor.fetchall()
    df2 = pd.DataFrame(result, columns=['playlist_id', 'USER_ID'])

    # Playlist_track 데이터 로딩
    query = "SELECT PLAYLIST_ID, TRACK_ID, cnt, rating FROM PLAYLIST_TRACK ORDER BY PLAYLIST_ID ASC;"
    cursor.execute(query)
    result = cursor.fetchall()
    df3 = pd.DataFrame(result, columns=['PLAYLIST_ID', 'TRACK_ID', 'cnt', 'rating'])

    # 필요한 데이터프레임을 병합하고 전처리
    df = pd.merge(df2, df3, left_on='playlist_id', right_on='PLAYLIST_ID')
    df = pd.merge(df, df1, left_on='USER_ID', right_on='id')

    # 필요한 컬럼만 선택
    df = df[['USER_ID', 'TRACK_ID', 'rating', 'birth_date', 'gender']]

    # 데이터 전처리
    df['birth_date'] = pd.to_datetime(df['birth_date'])
    df['age'] = (datetime.now().year - df['birth_date'].dt.year) // 10
    df['gender'] = df['gender'].apply(lambda x: 1 if x == '남' else 0)

    user_ids = df['USER_ID'].unique()
    track_ids = df['TRACK_ID'].unique()

    num_users = len(user_ids)
    num_tracks = len(track_ids)

    user2user_encoded = {x: i for i, x in enumerate(user_ids)}
    userencoded2user = {i: x for i, x in enumerate(user_ids)}
    track2track_encoded = {x: i for i, x in enumerate(track_ids)}
    track_encoded2track = {i: x for i, x in enumerate(track_ids)}

    df['USER'] = df['USER_ID'].map(user2user_encoded)
    df['TRACK'] = df['TRACK_ID'].map(track2track_encoded)

    # 모델 로드
    model = load_model('/home/ubuntu/project/4.5HZ/추천시스템/협업필터링/Collaborative_Filtering_model_2.h5')

    # 사용자 정보와 추천 생성 함수 정의
    def get_user_info(user_id):
        user_info = df1.loc[df1['id'] == user_id]

        if user_info.empty:
            print(f"ID가 {user_id}인 사용자를 찾을 수 없습니다.")
            return None, None, None, None

        birth_year = user_info['birth_date'].values[0].year
        age = (datetime.now().year - birth_year) // 10
        gender = 1 if user_info['gender'].values[0] == 'M' else 0

        nickname = user_info['nickname'].values[0]
        username = user_info['username'].values[0]
        birth_date = user_info['birth_date'].values[0]

        return age, gender, nickname, username, birth_date

    # 사용자 ID 리스트 생성
    user_ids = df['USER_ID'].unique()

    # 각 사용자마다 추천 음악을 생성
    for user_id in user_ids:
        age, gender, nickname, username, birth_date = get_user_info(user_id)

        if age is not None:
            user_array = np.array([user_id for _ in range(num_tracks)])
            age_array = np.array([age for _ in range(num_tracks)])
            gender_array = np.array([gender for _ in range(num_tracks)])
            track_array = np.array(range(num_tracks))

            inputs = [user_array, track_array, age_array, gender_array]
            predictions = model.predict(inputs)

            top_track_indices = np.argsort(predictions[:, 0])[::-1]
            recommended_track_ids = [track_encoded2track[i] for i in top_track_indices[:5]]
            recommended_track_scores = [predictions[i][0] for i in top_track_indices[:5]]

            now = datetime.now() 
            formatted_date = now.strftime('%Y-%m-%d %H:%M:%S')  

            for track_id_2, score in zip(recommended_track_ids, recommended_track_scores):
                insert_query = f"INSERT INTO MUSIC_RECOMMEND_2 (TRACK_ID, USER_ID, created_at) VALUES ('{track_id_2}', {user_id}, '{formatted_date}');"  
                cursor.execute(insert_query)
                                    
                # MySQL에 변경사항 저장
                connection.commit()






# import pandas as pd
# import numpy as np
# from keras.models import load_model
# from datetime import datetime
# from airflow.providers.mysql.hooks.mysql import MySqlHook

# # MySQL 연결 설정
# mysql_hook = MySqlHook(mysql_conn_id='mysql_db')
# connection = mysql_hook.get_conn()
# cursor = connection.cursor()

# # USERS 정보 가져오기
# query = "SELECT id, username, nickname, birth_date, gender FROM USERS ORDER BY id ASC;"
# cursor.execute(query)
# result = cursor.fetchall()
# df1 = pd.DataFrame(result, columns=['id', 'username', 'nickname', 'birth_date', 'gender'])

# # Playlist 정보 가져오기
# query = "SELECT * FROM PLAYLIST ORDER BY playlist_id ASC;"
# cursor.execute(query)
# result = cursor.fetchall()
# df2 = pd.DataFrame(result, columns=['playlist_id', 'USER_ID'])

# # Playlist_track 데이터 로딩
# query = "SELECT PLAYLIST_ID, TRACK_ID, cnt, rating FROM PLAYLIST_TRACK ORDER BY PLAYLIST_ID ASC;"
# cursor.execute(query)
# result = cursor.fetchall()
# df3 = pd.DataFrame(result, columns=['PLAYLIST_ID', 'TRACK_ID', 'cnt', 'rating'])

# # 필요한 데이터프레임을 병합하고 전처리
# df = pd.merge(df2, df3, left_on='playlist_id', right_on='PLAYLIST_ID')
# df = pd.merge(df, df1, left_on='USER_ID', right_on='id')

# # 필요한 컬럼만 선택
# df = df[['USER_ID', 'TRACK_ID', 'rating', 'birth_date', 'gender']]

# # 데이터 전처리
# df['birth_date'] = pd.to_datetime(df['birth_date'])
# df['age'] = (datetime.now().year - df['birth_date'].dt.year) // 10
# df['gender'] = df['gender'].apply(lambda x: 1 if x == '남' else 0)


# user_ids = df['USER_ID'].unique()
# track_ids = df['TRACK_ID'].unique()

# num_users = len(user_ids)
# num_tracks = len(track_ids)

# user2user_encoded = {x: i for i, x in enumerate(user_ids)}
# userencoded2user = {i: x for i, x in enumerate(user_ids)}
# track2track_encoded = {x: i for i, x in enumerate(track_ids)}
# track_encoded2track = {i: x for i, x in enumerate(track_ids)}

# df['USER'] = df['USER_ID'].map(user2user_encoded)
# df['TRACK'] = df['TRACK_ID'].map(track2track_encoded)

# # 모델 로드
# model = load_model('/home/ubuntu/project/4.5HZ/추천시스템/협업필터링/Collaborative_Filtering_model_2.h5')

# # 사용자 정보와 추천 생성 함수 정의
# def get_user_info(user_id):
#     user_info = df1.loc[df1['id'] == user_id]

#     if user_info.empty:
#         print(f"ID가 {user_id}인 사용자를 찾을 수 없습니다.")
#         return None, None, None, None

#     birth_year = user_info['birth_date'].values[0].year
#     age = (datetime.now().year - birth_year) // 10
#     gender = 1 if user_info['gender'].values[0] == 'M' else 0

#     nickname = user_info['nickname'].values[0]
#     username = user_info['username'].values[0]
#     birth_date = user_info['birth_date'].values[0]

#     return age, gender, nickname, username, birth_date


# # 사용자 ID 리스트 생성
# user_ids = df['USER_ID'].unique()

# # 각 사용자마다 추천 음악을 생성
# for user_id in user_ids:
#     age, gender, nickname, username, birth_date = get_user_info(user_id)

#     if age is not None:

#         user_array = np.array([user_id for _ in range(num_tracks)])
#         age_array = np.array([age for _ in range(num_tracks)])
#         gender_array = np.array([gender for _ in range(num_tracks)])
#         track_array = np.array(range(num_tracks))

#         inputs = [user_array, track_array, age_array, gender_array]
#         predictions = model.predict(inputs)

#         top_track_indices = np.argsort(predictions[:, 0])[::-1]
#         recommended_track_ids = [track_encoded2track[i] for i in top_track_indices[:5]]
#         recommended_track_scores = [predictions[i][0] for i in top_track_indices[:5]]

#         # 추천 음악 ID와 예상 평점을 함께 출력
#         print(f"\nUser ID: {username}님에게 추천하는 음악_2")
#         for track_id_2, score in zip(recommended_track_ids, recommended_track_scores):
#             print(f"Track ID: {track_id_2}, 예상 평점: {score}")

#             now = datetime.now() 
#             formatted_date = now.strftime('%Y-%m-%d %H:%M:%S')  
#             insert_query = f"INSERT INTO MUSIC_RECOMMEND_2 (TRACK_ID, USER_ID, created_at) VALUES ('{track_id_2}', {user_id}, '{formatted_date}');"  
#             cursor.execute(insert_query)
                                
#             # MySQL에 변경사항 저장
#             connection.commit()