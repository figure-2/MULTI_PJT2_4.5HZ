import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from static_app.models import user_track_agg
from .models import AudioFeature

# 사용자 기준 많이 들은 곡 2개 
def pick_user_top2(request):

    current_user_id = request.user.nickname
    print('current_user_id :', current_user_id)
    
    # 현재 사용자와 user_id 일치하는 필터링 진행
    current_user_static = user_track_agg.objects.filter(user_id=current_user_id)
    print('current_user_static:',current_user_static)
    
    # cnt 내림차순으로 정렬 후 상위 2개 레코드 가져오기
    current_user_top = current_user_static.order_by('-cnt')[:2]
    print('current_user_top:',current_user_top)

    # 가져온 레코드에서 track_id만 추출하여 리스트로 반환
    current_user_top2 = [record.track_id.track_id for record in current_user_top]
    print('current_user_top2:', current_user_top2)
    
    return current_user_top2

# 해당하는 곡의 군집 파악 후 가장 코사인 유사도 높은 2곡 뽑기
def find_top_similar_in_cluster(current_user_top2):
    # print('df_cluster:',df_cluster.head())
    
    check_list = []
    final_result = pd.DataFrame()
    
    for current_user_top in current_user_top2:

        sample_row_queryset = AudioFeature.objects.filter(track_id_id=current_user_top)
        sample_row_values = sample_row_queryset.values('track_id_id','pca_x', 'pca_y', 'gmm_cluster')
        sample_row = pd.DataFrame.from_records(sample_row_values)

        print('sample_row:',sample_row)
        
        # 해당 행의 군집 뽑아놓기
        sample_cluster = sample_row['gmm_cluster'].values[0]
        print('sample_cluster:',sample_cluster)

        # 같은 군집 내의 음원들만 선택        
        df_same_cluster = AudioFeature.objects.filter(gmm_cluster=sample_cluster).values('track_id_id', 'pca_x', 'pca_y', 'gmm_cluster')
        df_same_cluster = pd.DataFrame.from_records(df_same_cluster)


        # 선택한 음원과 같은 군집 내 음원들의 벡터 데이터
        df_sample_vector = sample_row[['pca_x', 'pca_y']].values
        df_same_cluster_vector = df_same_cluster[['pca_x', 'pca_y']].values
        print('vector : 출력됨')

        # 코사인 유사도 계산
        cosine_similarities = cosine_similarity(df_sample_vector, df_same_cluster_vector)
        print('cosine_similarities : ',cosine_similarities)

        # 가장 유사한 곡 2개 선택
        similar1 = np.argsort(cosine_similarities, axis=1)[:, ::-1][:, 1:17] # [:, ::-1] = 내림차순 정렬 / [:, :2] = 각 행에서 가장 큰 2개
        print("similar1:",similar1)
        
        check_list.extend(similar1.flatten().tolist())
        
        selected_rows = df_same_cluster.iloc[similar1.flatten().tolist()]
        selected_rows['similarity'] = cosine_similarities.flatten()[similar1.flatten()]

        print('selected_rows:',selected_rows)
        
        final_result = pd.concat([final_result, selected_rows])
        print('final_result:',final_result)

        
    check_list = list(set(check_list))
    print('check_list:', check_list)

    return final_result