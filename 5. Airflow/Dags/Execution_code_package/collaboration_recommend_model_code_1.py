import pandas as pd
from surprise import Reader, Dataset, SVD, accuracy
from surprise.accuracy import rmse
from surprise.model_selection import cross_validate, train_test_split
from sklearn.model_selection import ParameterGrid
from airflow.hooks.mysql_hook import MySqlHook
import pickle
from tqdm import tqdm

def collaboration_recommend_code_1():
    # MySQL 연결 설정
    mysql_hook = MySqlHook(mysql_conn_id='mysql_db')
    connection = mysql_hook.get_conn()
    cursor = connection.cursor()
    
   # Playlist_track 데이터 로딩
    query = "SELECT PLAYLIST_ID, TRACK_ID, cnt, rating FROM PLAYLIST_TRACK ORDER BY PLAYLIST_ID ASC;"
    cursor.execute(query)
    result = cursor.fetchall()
    df = pd.DataFrame(result, columns=['PLAYLIST_ID', 'TRACK_ID', 'cnt', 'rating'])

    # 2. 정보 확인
    print(df.info())
    print(df.isnull().sum())
    print(df.shape)

    # 3. 데이터 전처리
    reader = Reader(rating_scale=(0, 5))  
    data = Dataset.load_from_df(df[['PLAYLIST_ID', 'TRACK_ID', 'rating']], reader) 

    # 4. 모델 학습
    model = SVD()
    cross_validate(model, data, measures=['RMSE', 'MAE'], cv=5, verbose=True)  

    #5. 모델 테스트
    trainset, testset = train_test_split(data,_size=.25)
    model.fit(trainset)
    predictions = model.test(testset)
    accuracy.rmse(predictions)

    # 6. 그리드서치 통한 하이퍼파라미터 최적화
    param_grid = {'n_epochs': [5, 10, 20], 'lr_all': [0.001, 0.002, 0.005], 'reg_all': [0.2, 0.4, 0.6]}
    #param_grid = {'n_epochs': [5], 'lr_all': [0.001], 'reg_all': [0.2]} # 코드 확인용
    grid = ParameterGrid(param_grid)

    best_params = {}
    best_score = float('inf')

    for params in tqdm(grid):
        algo = SVD(**params)
        cv_results = cross_validate(algo, data, measures=['RMSE', 'MAE'], cv=5)
        mean_rmse = cv_results['test_rmse'].mean()

        if mean_rmse < best_score:
            best_score = mean_rmse
            best_params = params

    print(f"Best params: {best_params}, Best score: {best_score:.f}")

    # 7. 최적의 하이퍼파라미터를 사용하여 SVD 모델 학습
    algo = SVD(**best_params)
    trainset, testset = train_test_split(data, test_size=.25)
    algo.fit(trainset)
    predictions = algo.test(testset)
    accuracy.rmse(predictions) 

    # 8. 전체 데이터로 최종 모델 학습
    full_trainset = data.build_full_trainset()
    algo.fit(full_trainset)

    # 9. 모델 저장
    pickle.dump(algo, open('/home/ubuntu/airflow/dags/recommend/Collaborative_Filtering_model_test.pkl', 'wb'))


collaboration_recommend_code_1()
