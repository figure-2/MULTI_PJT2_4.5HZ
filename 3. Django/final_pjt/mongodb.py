from pymongo import MongoClient
from datetime import datetime, timedelta
from django.conf import settings

def find_log():  
    client = MongoClient("127.0.0.1:27017")

    db = client.log_db
    track_collection = db.streaming_track_agg # stream_track_agg

    doc = track_collection.find({})

    today_date = datetime.now().date()
    
    updated_documents = []
    for i in doc:
        start_time = i["start"] + timedelta(hours=9)
        end_time = i["end"] + timedelta(hours=9)
        
        if start_time.date() == today_date:
            start = start_time.strftime("%Y-%m-%d %H:%M:%S")
            end = end_time.strftime("%Y-%m-%d %H:%M:%S")
            i["start"] = start
            i["end"] = end
            # print("start : " + start , "end : " + end)
            updated_documents.append(i)
        
    return updated_documents

# find_log()
# log_mongodb = find_log()

# for i in log_mongodb:
#     print(i)