# @login_required
# def load_collaborative_filtering_model():
#     model_path = '/home/ubuntu/makedjango/final_pjt/music_rec_app/model/Collaborative_Filtering_model_2.h5'
#     with open(model_path, 'rb') as model_file:
#         collaborative_filtering_model = pickle.load(model_file)
#     return collaborative_filtering_model
  
# @login_required
# def recommend_music_2(request, user_id):
#     # Load Collaborative Filtering model
#     collaborative_filtering_model = load_collaborative_filtering_model()

#     # Find playlists of users with the same gender and age group
#     user_playlists = PlaylistTrack.objects.filter(playlist__user__id=user_id)
#     user_gender = request.user.gender
#     user_age_group = request.user.age_group

#     similar_users_playlists = PlaylistTrack.objects.filter(
#         playlist__user__gender=user_gender,
#         playlist__user__age_group=user_age_group
#     ).exclude(playlist__user__id=user_id)

#     # Create a list of unique track_ids that the user has not listened to
#     user_tracks = user_playlists.values_list('track__track_id', flat=True)
#     similar_users_tracks = similar_users_playlists.values_list('track__track_id', flat=True).distinct()

#     new_tracks_for_user = [track_id for track_id in similar_users_tracks if track_id not in user_tracks]

#     # Get predictions for the new tracks
#     predictions = [(track_id, collaborative_filtering_model.predict(user_id, str(track_id)).est) for track_id in new_tracks_for_user]

#     # Sort predictions by the estimated ratings
#     predictions.sort(key=lambda x: x[1], reverse=True)

#     # Select the top 5 tracks
#     top_tracks = predictions[:5]

#     # Fetch Track objects for the recommended track_ids
#     recommended_tracks = [Track.objects.get(track_id=track_id) for track_id, _ in top_tracks]

#     return render(request, 'music.html', {'recommended_songs_2': recommended_tracks})



#---

# @login_required
# def recommend_music_2(request, user_id):
#     collaborative_filtering_model = pickle.load(open('/home/ubuntu/makedjango/final_pjt/music_rec_app/model/Collaborative_Filtering_model_2.h5', 'rb'))

#     user_playlists = PlaylistTrack.objects.filter(playlist__user__id=user_id)
#     print('user_playlists:', user_playlists)  # 사용자의 재생 목록 확인

#     user_gender = request.user.gender
#     user_age_group = request.user.age_group

#     similar_users_playlists = PlaylistTrack.objects.filter(
#         playlist__user__gender=user_gender,
#         playlist__user__age_group=user_age_group
#     ).exclude(playlist__user__id=user_id)
#     print('similar_users_playlists:', similar_users_playlists)  # 유사한 사용자의 재생 목록 확인

#     user_tracks = user_playlists.values_list('track__track_id', flat=True)
#     print('user_tracks:', user_tracks)  # 사용자가 들은 음악의 ID 확인

#     similar_users_tracks = similar_users_playlists.values_list('track__track_id', flat=True).distinct()
#     print('similar_users_tracks:', similar_users_tracks)  # 유사한 사용자가 들은 음악의 ID 확인

#     new_tracks_for_user = [track_id for track_id in similar_users_tracks if track_id not in user_tracks]
#     print('new_tracks_for_user:', new_tracks_for_user)  # 사용자가 아직 듣지 않은 음악의 ID 확인

#     predictions = [(track_id, collaborative_filtering_model.predict(user_id, str(track_id)).est) for track_id in new_tracks_for_user]
#     print('predictions:', predictions)  # 예측 점수 확인

#     predictions.sort(key=lambda x: x[1], reverse=True)

#     top_tracks = predictions[:5]
#     print('top_tracks:', top_tracks)  # 상위 5개 추천 음악의 ID와 예측 점수 확인

#     recommended_tracks = [Track.objects.get(track_id=track_id) for track_id, _ in top_tracks]
#     print('recommended_tracks:', recommended_tracks)  # 추천된 음악의 실제 객체 확인

#     return render(request, 'music.html', {'recommended_playlists': recommended_tracks})

#----------------
# 최근 12월 28일 
# @login_required
# def recommend_music_2(request, user_id):
#     collaborative_filtering_model = pickle.load(open('/home/ubuntu/makedjango/final_pjt/music_rec_app/model/Collaborative_Filtering_model_2.h5', 'rb'))

#     user_playlists = PlaylistTrack.objects.filter(playlist__user__id=user_id)

#     user_gender = request.user.gender
#     user_age_group = request.user.age_group

#     similar_users_playlists = PlaylistTrack.objects.filter(
#         playlist__user__gender=user_gender,
#         playlist__user__age_group=user_age_group
#     ).exclude(playlist__user__id=user_id)

#     user_tracks = user_playlists.values_list('track__track_id', flat=True)

#     similar_users_tracks = similar_users_playlists.values_list('track__track_id', flat=True).distinct()

#     new_tracks_for_user = [track_id for track_id in similar_users_tracks if track_id not in user_tracks]

#     predictions = [(track_id, collaborative_filtering_model.predict(user_id, str(track_id)).est) for track_id in new_tracks_for_user]

#     predictions.sort(key=lambda x: x[1], reverse=True)

#     top_tracks = predictions[:5]

#     recommended_tracks = []
#     for track_id, _ in top_tracks:
#         track = Track.objects.get(track_id=track_id)
#         recommended_tracks.append({
#             'track_id': track.track_id,
#             'track_name': track.track_name,
#         })

#     return recommended_tracks