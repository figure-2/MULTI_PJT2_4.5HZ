import pandas as pd
import numpy as np
from math import sqrt
from datetime import datetime
from surprise import Dataset, Reader, SVD, accuracy
from surprise.model_selection import cross_validate, GridSearchCV
from sklearn.metrics import mean_squared_error, mean_absolute_error
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.model_selection import train_test_split
from keras.models import Model
from keras.layers import Input, Embedding, Flatten, Dot, Dense, Concatenate, Dropout
from keras.optimizers import Adam
from kerastuner.tuners import RandomSearch
from kerastuner import HyperParameters
from tensorflow.keras.layers import Embedding
from kerastuner.engine import hyperparameters as hp


def collaboration_recommend_code_2():
    mysql_hook = MySqlHook(mysql_conn_id='mysql_db')
    connection = mysql_hook.get_conn()
    cursor = connection.cursor()

    query = "SELECT id, username, nickname, birth_date, gender FROM USERS ORDER BY id ASC;"
    cursor.execute(query)
    result = cursor.fetchall()
    df1 = pd.DataFrame(result, columns=['id', 'username', 'nickname', 'birth_date', 'gender'])

    query = "SELECT * FROM PLAYLIST ORDER BY playlist_id ASC;"
    cursor.execute(query)
    result = cursor.fetchall()
    df2 = pd.DataFrame(result, columns=['playlist_id', 'USER_ID'])

    query = "SELECT PLAYLIST_ID, TRACK_ID, cnt, rating FROM PLAYLIST_TRACK ORDER BY PLAYLIST_ID ASC;"
    cursor.execute(query)
    result = cursor.fetchall()
    df3 = pd.DataFrame(result, columns=['PLAYLIST_ID', 'TRACK_ID', 'cnt', 'rating'])


    df = pd.merge(df2, df3, left_on='playlist_id', right_on='PLAYLIST_ID')
    df = pd.merge(df, df1, left_on='USER_ID', right_on='id')

    df = df[['USER_ID', 'TRACK_ID', 'rating', 'birth_date', 'gender']]

    df['birth_date'] = pd.to_numeric(df['birth_date'], errors='coerce')
    df['age'] = (2023 - df['birth_date']) // 10


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

    df['age'] = df['age'].astype('category').cat.codes
    df['gender'] = df['gender'].astype('category').cat.codes

    train, test = train_test_split(df, test_size=0.2, random_state=42)

    train_inputs = [train.USER.values, train.TRACK.values, train.age.values, train.gender.values]
    train_targets = train.rating.values

    test_inputs = [test.USER.values, test.TRACK.values, test.age.values, test.gender.values]
    test_targets = test.rating.values

    user_input = Input(shape=(1,), name='user_input', dtype='int64')
    user_embedding = Embedding(num_users, 10, name='user_embedding')(user_input)
    user_vec = Flatten(name='flatten_users')(user_embedding)

    track_input = Input(shape=(1,), name='track_input', dtype='int64')
    track_embedding = Embedding(num_tracks, 10, name='track_embedding')(track_input)
    track_vec = Flatten(name='flatten_tracks')(track_embedding)

    age_input = Input(shape=(1,), name='age_input', dtype='int64')
    age_embedding = Embedding(df.age.nunique(), 5, name='age_embedding')(age_input)
    age_vec = Flatten(name='flatten_ages')(age_embedding)

    gender_input = Input(shape=(1,), name='gender_input', dtype='int64')
    gender_embedding = Embedding(df.gender.nunique(), 5, name='gender_embedding')(gender_input)
    gender_vec = Flatten(name='flatten_genders')(gender_embedding)

    concat = Concatenate()([user_vec, track_vec, age_vec, gender_vec])
    dropout = Dropout(0.5)(concat) 
    dense = Dense(128, activation='relu')(dropout) 
    dense = Dense(64, activation='relu')(dense)
    output = Dense(1)(dense)

    model = Model([user_input, track_input, age_input, gender_input], output)

    model.compile(optimizer=Adam(0.001), loss='mean_squared_error')
    history = model.fit(train_inputs, train_targets, batch_size=64, epochs=5, verbose=1, validation_split=0.2)

    model.evaluate(test_inputs, test_targets)
    preds = model.predict(test_inputs)

    def build_model(hp):
        user_input = Input(shape=(1,), name='user_input', dtype='int64')
        user_embedding = Embedding(num_users, hp.Int('user_embedding_dim', 5, 15, step=5), name='user_embedding')(user_input)
        user_vec = Flatten(name='flatten_users')(user_embedding)

        track_input = Input(shape=(1,), name='track_input', dtype='int64')
        track_embedding = Embedding(num_tracks, hp.Int('track_embedding_dim', 5, 15, step=5), name='track_embedding')(track_input)
        track_vec = Flatten(name='flatten_tracks')(track_embedding)

        age_input = Input(shape=(1,), name='age_input', dtype='int64')
        age_embedding = Embedding(df.age.nunique(), hp.Int('age_embedding_dim', 2, 10, step=2), name='age_embedding')(age_input)
        age_vec = Flatten(name='flatten_ages')(age_embedding)

        gender_input = Input(shape=(1,), name='gender_input', dtype='int64')
        gender_embedding = Embedding(df.gender.nunique(), hp.Int('gender_embedding_dim', 2, 10, step=2), name='gender_embedding')(gender_input)
        gender_vec = Flatten(name='flatten_genders')(gender_embedding)

        concat = Concatenate()([user_vec, track_vec, age_vec, gender_vec])
        dropout = Dropout(hp.Float('dropout_rate', 0.0, 0.5, step=0.1))(concat)
        dense = Dense(hp.Int('dense_1_units', 64, 256, step=64), activation='relu')(dropout)
        dense = Dense(hp.Int('dense_2_units', 32, 128, step=32), activation='relu')(dense)
        output = Dense(1)(dense)

        model = Model([user_input, track_input, age_input, gender_input], output)
        model.compile(optimizer=Adam(hp.Float('learning_rate', 1e-4, 1e-2, sampling='log')), loss='mean_squared_error')

        return model

    tuner = RandomSearch(
        build_model,
        objective='val_loss',
        max_trials=1, # 10
        executions_per_trial=1, # 3
        directory='my_dir',
        project_name='helloworld')

    tuner.search(train_inputs, train_targets, 
                epochs=5, 
                validation_split=0.2, 
                batch_size=32) 


    best_hps = tuner.get_best_hyperparameters(num_trials=1)[0]

    model = build_model(best_hps)

    model.compile(optimizer=Adam(best_hps.get('learning_rate')), 
                  loss='mean_squared_error')

    history = model.fit(train_inputs, train_targets, 
                        epochs=5, 
                        validation_split=0.2, 
                        batch_size=32,
                        verbose=1)  

    test_loss = model.evaluate(test_inputs, test_targets, verbose=0)

    print('테스트 손실:', test_loss)

    model.save('/home/ubuntu/airflow/dags/recommend/collaboration_recommend_model_2.h5')


