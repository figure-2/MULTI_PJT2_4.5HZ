from pyspark.sql import SparkSession
from pyspark.sql.types import DateType
from datetime import datetime, timedelta
from pyspark.sql.functions import col, date_format
import pyspark.sql.functions as F
MAX_MEMORY = '5g'

spark = (
    SparkSession.builder.appName("django-log-preprocess")
        .config("spark.executor.memory", MAX_MEMORY)
        .config("spark.driver.memory", MAX_MEMORY)
        .getOrCreate()
)
    
log_file = "/home/ubuntu/makedjango/final_pjt/logs/log_test.json"

log_data = spark.read.json(log_file)

# 데이터 정제
## 1. 필요한 컬럼만 남겨두기 / null값 삭제, secret 유저 삭제
log_data.createOrReplaceTempView("log")

query = """

    SELECT user_id, username, artist_id, artist, track_id, track, track_genre, time, date_format(time, 'E') AS day_of_week
    FROM log
    WHERE track is not null and username != 'secret' and username != '테스트' and artist_id is not null and track_genre is not null

"""
data_df = spark.sql(query)


## 2. 주어진 기간 내의 데이터 필터링
start_date = datetime.now().date() - timedelta(days=7) # 월 (12/11)
end_date = datetime.now().date() - timedelta(days=1)  # 일 (12/17) - timedelta(days=1)


filter_data_df = data_df.filter(
    (date_format(col('time'), 'yyyy-MM-dd') >= start_date) & 
    (date_format(col('time'), 'yyyy-MM-dd') <= end_date)
)

 ## 3. 집계 기준 날짜 추가
filter_data_df_append_start = filter_data_df.withColumn("start_date",F.lit(start_date))
filter_data_df_append_end = filter_data_df_append_start.withColumn("end_date",F.lit(end_date))
# filter_data_df_append_end.show()

data_dir = "/home/ubuntu/airflow/save/preprocess_result"
filter_data_df_append_end.write.format("parquet").mode("overwrite").save(f"{data_dir}")

spark.stop()





## 2. time 컬럼의 데이터 타입을 DateType으로 변경
# data_df = data_df.withColumn("time", data_df["time"].cast(DateType()))
# data_df = data_df.withColumn("time", col("time").cast("timestamp"))

# 2. 요일 파생 컬럼 추가
# data_df = data_df.withColumn("day_of_week", date_format(col("time"), "E"))