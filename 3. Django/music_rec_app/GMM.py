# from sklearn.mixture import GaussianMixture
# from sklearn.preprocessing import StandardScaler
# from sklearn.decomposition import PCA
# import pandas as pd
# from music_rec_app.models import AudioFeature

# def gmm_model():
#     audio_features = AudioFeature.objects.values('id', 'danceability', 'energy', 'loudness', 'acousticness', 'tempo')

#     df_gmm = pd.DataFrame.from_records(audio_features)

#     scaler = StandardScaler()
#     df_scaled = scaler.fit_transform(df_gmm[['danceability', 'energy', 'loudness', 'acousticness', 'tempo']])

#     pca = PCA(n_components=2)
#     df_pca = pca.fit_transform(df_scaled)

#     gmm = GaussianMixture(n_components=6, random_state=42)
#     gmm.fit(df_pca)

#     df_gmm['pca_x'] = df_pca[:, 0]
#     df_gmm['pca_y'] = df_pca[:, 1]
#     df_gmm['gmm_cluster'] = gmm.predict(df_pca)

#     # DB에 추가
#     for index, row in df_gmm.iterrows():
#         audio_features = AudioFeature.objects.get(id=row['id'])
#         audio_features.pca_x = row['pca_x']
#         audio_features.pca_y = row['pca_y']
#         audio_features.gmm_cluster = row['gmm_cluster']
#         audio_features.save()
#         print(f'{index}')

#     return None

# gmm_model()

