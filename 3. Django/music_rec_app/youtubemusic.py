from .models import Track
from googlesearch import search
from IPython.display import YouTubeVideo
    
# def get_youtube_video(track):
def get_youtube_link(track):
    search_query = track.track_name + ' ' + track.artist_name
    print(search_query)

    try:
        
        search_results = search(search_query, num=1, stop=1, pause=2, tld='co.kr')
        first_result = next(search_results)
        print("First Result:", first_result)
        return first_result
    
    except Exception as e:
        print("=====링크 None====")
        return None



        # search_results = search(search_query, num=10, stop=1, pause=2, tld='co.kr')
        # for result in search_results:
        #     print(result)
        #     if 'youtube' in result:
        #         return result
                
        # return None
    
            

    # youtube_link = get_youtube_link(track)
    # print(youtube_link)

    # if youtube_link:
    #     video_id = youtube_link.split('v=')[1]
    #     print(video_id)
    #     if len(video_id) > 1:
    #         # video_id[1]을 사용하지 않고 그대로 video_id를 사용합니다.
    #         youtube_url = f"https://www.youtube.com/embed/{video_id}"
    #         return youtube_url
    # else:
    #     print("=====마지막 None====")
    #     return None
    
    
    
    
    

    # if youtube_link:
    #     video_id_list = youtube_link.split('v=')[1]
    #     print(video_id_list)
    #     if len(video_id_list) > 1:
    #         video_id = video_id_list[1]
    #         youtube_url = f"https://www.youtube.com/embed/{video_id}"
    #         return youtube_url
    #     else:
    #         print("=====마지막 None====")
    #         return None
    # else:
    #     print("=====마지막 None====")
    #     return None



# def get_youtube_link(track):
#     search_query = f'"{track.track_name}" "{track.artist_name}"'
#     print("Search Query:", search_query)

#     try:
#         search_results = search(search_query, num=1, stop=1, pause=2, tld='co.kr')
#         first_result = next(search_results)
#         print("First Result:", first_result)
#         return first_result
#     except Exception as e:
#         print("=====링크 None====")
#         return None

# def get_youtube_video(track):
#     youtube_link = get_youtube_link(track)

#     if youtube_link:
#         video_id_list = youtube_link.split('v=')
#         if len(video_id_list) > 1:
#             video_id = video_id_list[1]
#             return YouTubeVideo(video_id)
#         else:
#             print("=====마지막 None====")
#             return None
#     else:
#         print("=====마지막 None====")
#         return None