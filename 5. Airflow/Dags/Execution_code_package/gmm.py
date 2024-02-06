from airflow.providers.mysql.hooks.mysql import MySqlHook
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.mixture import GaussianMixture
from datetime import datetime, timedelta


def gmm_model():
    date = datetime.now().date()
    now_time = datetime.now().strftime("%H:%M")

    mysql_hook = MySqlHook(mysql_conn_id='mysql_db')  # MySQL Connection ID
    connection = mysql_hook.get_conn()
    cursor = connection.cursor()

    sql_query = " SELECT id, danceability, energy, loudness, acousticness, tempo, track_id FROM AUDIO_FEATURS" # SELECT id, danceability, energy, loudness, acousticness, tempo FROM AUDIO_FEATURS

    cursor.execute(sql_query)
    results = cursor.fetchall()
    # print(results[-10:])

    df_gmm = pd.DataFrame(results, columns=['id', 'danceability', 'energy', 'loudness', 'acousticness', 'tempo', 'track_id'])
    # print(df_gmm)

    # 스케일링
    scaler = StandardScaler()
    features_scaled = scaler.fit_transform(df_gmm[['danceability', 'energy', 'loudness', 'acousticness', 'tempo']])
    # print(features_scaled)

    # 차원축소
    pca = PCA(n_components=2)
    features_pca = pca.fit_transform(features_scaled)
    # print(features_pca)

    # GMM
    gmm = GaussianMixture(n_components=6, random_state=42)
    gmm.fit(features_pca)

    # 데이터에 추가
    df_gmm['pca_x'] = features_pca[:, 0]
    df_gmm['pca_y'] = features_pca[:, 1]
    df_gmm['gmm_cluster'] = gmm.predict(features_pca)
    # print(df_gmm.head())

    # csv 파일 저장
    df_gmm.to_csv(f'/home/ubuntu/airflow/save/gmm_result/GMM_cluster_{date}-{now_time}.csv', index=False)

    for index, row in df_gmm.iterrows():
        update_query = f"""
            UPDATE AUDIO_FEATURS
            SET pca_x = {row['pca_x']}, pca_y = {row['pca_y']}, gmm_cluster = {row['gmm_cluster']}
            WHERE id = {row['id']}
        """
        try:
            cursor.execute(update_query)
            print(f"{index+1}")
        except Exception as e:
            raise
            
    connection.commit() # DB에 반영

    cursor.close()
    connection.close()
    return df_gmm





