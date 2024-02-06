from pyspark.sql import SparkSession
from datetime import datetime, timedelta
import pyspark.sql.functions as F

MAX_MEMEORY = '5g'
spark = (
        SparkSession.builder.appName("django-log-aggregate")
            .config("spark.executor.memory", MAX_MEMEORY)
            .config("spark.driver.memory", MAX_MEMEORY)
            .getOrCreate())

data_dir = "/home/ubuntu/airflow/save/preprocess_result"
log_pre_df = spark.read.parquet(f"{data_dir}")

start_date = datetime.now().date() - timedelta(days=7)
end_date = datetime.now().date() - timedelta(days=1)

log_pre_df.createOrReplaceTempView("log_df")

# 1. 유저별 track 집계
query = """

    SELECT
        user_id,
        username,
        track_id,
        track,
        count(*) cnt,
        start_date,
        end_date
    FROM log_df
    GROUP BY user_id, username, track_id, track, start_date, end_date
    ORDER BY username, cnt desc 

"""

track_cnt_agg = spark.sql(query)
# track_cnt_agg.show()

# 2. 유저별 artist 집계
query2 = """

    SELECT
        user_id,
        username,
        artist_id,
        artist,
        count(*) cnt,
        start_date,
        end_date
    FROM log_df
    GROUP BY user_id, username, artist_id, artist, start_date, end_date
    ORDER BY username, cnt desc 

"""

artist_cnt_agg = spark.sql(query2)
# artist_cnt_agg.show()

# 3. 일별 접속 횟수

query3 = """

    SELECT 
        user_id, 
        username,  
        day_of_week, 
        count(*) cnt,
        start_date,
        end_date
    FROM log_df
    GROUP BY user_id, username, day_of_week, start_date, end_date
    ORDER BY username, day_of_week
    
"""

day_cnt_agg = spark.sql(query3)
# day_cnt_agg.show()

day_cnt_agg.createOrReplaceTempView("USER_DAY_AGG")

query3_1 = """

    SELECT u.user_id, u.username, d.day_of_week, COALESCE(UDG.cnt, 0) as cnt
    FROM (
        SELECT DISTINCT user_id, username FROM USER_DAY_AGG
    ) u
    CROSS JOIN (
        SELECT 'Mon' as day_of_week UNION ALL
        SELECT 'Tue' UNION ALL
        SELECT 'Wed' UNION ALL
        SELECT 'Thu' UNION ALL
        SELECT 'Fri' UNION ALL
        SELECT 'Sat' UNION ALL
        SELECT 'Sun'
    ) d
    LEFT JOIN USER_DAY_AGG UDG ON u.user_id = UDG.user_id AND d.day_of_week = UDG.day_of_week
    ORDER BY u.user_id

"""
day_cnt_agg2 = spark.sql(query3_1)
day_cnt_agg3 = day_cnt_agg2.withColumn("start_date",F.lit(start_date))
day_cnt_agg4 = day_cnt_agg3.withColumn("end_date",F.lit(end_date))
# day_cnt_agg4.show()

# 4. 시간대별 접속 횟수
query4 = """

    SELECT 
        user_id,
        username,
        DATE_FORMAT(time,"H") as hour,
        count(*) cnt, 
        start_date, 
        end_date
    FROM log_df
    GROUP BY user_id, username, hour, start_date, end_date
    ORDER BY username, hour, cnt
    
"""

time_cnt_agg = spark.sql(query4)
time_cnt_agg.createOrReplaceTempView("USER_HOUR_AGG")

users = spark.sql("SELECT DISTINCT user_id, username, start_date, end_date FROM USER_HOUR_AGG")
hours = spark.range(1, 25).selectExpr("id AS hour")
user_hour = users.crossJoin(hours)

result = user_hour.join(spark.table("USER_HOUR_AGG"), ["user_id", "hour", "username", "start_date", "end_date"], "left").fillna(0)
result = result.select("user_id", "username", "hour", "cnt", "start_date", "end_date").orderBy("user_id", "hour")
# result.show()

# # 5. 선호하는 장르
query5 = """

    SELECT 
        user_id, 
        username,  
        track_genre, 
        count(*) cnt,
        start_date,
        end_date
    FROM log_df
    GROUP BY user_id, username, track_genre, start_date, end_date
    ORDER BY username, track_genre
"""

genre_cnt_agg = spark.sql(query5)
# genre_cnt_agg.show()

# 집계 데이터 저장
data_dir = "/home/ubuntu/airflow/save/aggregate_result"

track_agg_df = track_cnt_agg.toPandas()
track_agg_df.to_csv(f"{data_dir}/track_agg_{start_date}_{end_date}.csv", index=False)

artist_agg_df = artist_cnt_agg.toPandas()
artist_agg_df.to_csv(f"{data_dir}/artist_agg_{start_date}_{end_date}.csv", index=False)

day_agg_df = day_cnt_agg4.toPandas()
day_agg_df.to_csv(f"{data_dir}/day_agg_{start_date}_{end_date}.csv", index=False)

hour_agg_df = result.toPandas()
hour_agg_df.to_csv(f"{data_dir}/hour_agg_{start_date}_{end_date}.csv", index=False)

genre_agg_df = genre_cnt_agg.toPandas()
genre_agg_df.to_csv(f"{data_dir}/genre_agg_{start_date}_{end_date}.csv", index=False)

spark.stop()

