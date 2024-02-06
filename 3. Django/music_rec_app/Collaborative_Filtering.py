# @login_required
# def recommend_music(request,user_id):
#     loaded_model = pickle.load(open('/home/ubuntu/makedjango/final_pjt/music_rec_app/model/Collaborative_Filtering_model.pkl', 'rb'))

#     playlist_tracks = PlaylistTrack.objects.filter(playlist__user_id = user_id)
#     df = pd.DataFrame(list(playlist_tracks.values('playlist__user_id', 'track__track_id', 'rating')))

#     user_tracks = df[df['playlist__user_id'] == user_id]['track__track_id'].unique()
#     all_track_ids = [track_id for track_id in PlaylistTrack.objects.values_list('track__track_id', flat=True).distinct() if track_id not in user_tracks]

#     predictions = [loaded_model.predict(user_id, str(track_id)) for track_id in all_track_ids]
#     predictions.sort(key=lambda prediction: prediction.est, reverse=True)
#     top_tracks = [predictions[i].iid for i in range(5)]

#     #print('탑트랙스 확인 :', top_tracks)
    
#     result = []
#     for track_id in top_tracks:
#         recommended_track = PlaylistTrack.objects.filter(track__track_id=track_id).first()
#         if recommended_track:
#             result.append({
#                 'playlist_id': recommended_track.playlist.playlist_id,
#                 'track_id': recommended_track.track.track_id,
#                 'rating': recommended_track.rating
#             })

#     #print('결과 확인 :', result)
#     return result