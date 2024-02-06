from pyspark.sql import SparkSession
from pyspark.sql.types import StructType, StructField, StringType, IntegerType, TimestampType
import pyspark.sql.functions as F
from pyspark.sql.functions import from_utc_timestamp
from datetime import datetime

if __name__  == "__main__":
    
    # input_url = "mongodb://4.5HZ:12345@ec2-15-152-244-178.ap-northeast-3.compute.amazonaws.com:27017/logdb.track_agg?authSource=admin"
    # output_url = "mongodb://4.5HZ:12345@ec2-15-152-244-178.ap-northeast-3.compute.amazonaws.com:27017/logdb.track_agg?authSource=admin"
    # output_url = "mongodb://4.5HZ:12345@127.0.0.1:27017/"
    
    spark = (
        SparkSession.builder
            .appName("stream-kafka")
            .config("spark.sql.streaming.stateStore.stateSchemaCheck", "false")
            # .config("spark.sql.session.timeZone", "Asia/Seoul")
            .getOrCreate()
            # .config("spark.sql.session.timeZone", "Asia/Seoul")
            # .config("spark.mongodb.input.url", input_url)
            # .config("spark.mongodb.write.connection.uri", output_url)
            # .config("spark.jars.packages", "org.mongodb.spark:mongo-spark-connector_2.12:3.0.1")
    )
    # spark.conf.set("spark.sql.session.timeZone", "Asia/Seoul")
    spark.conf.set("spark.sql.session.timeZone", "Asia/Seoul")
    
    schema = StructType(
        [
            StructField("user_id", StringType(), True),
            StructField("gender", StringType(), True),
            StructField("username", StringType(), True),
            StructField("track", StringType(), True),
            StructField("artist", StringType(), True),
            StructField("track_id", StringType(), True),
            StructField("artist_id", StringType(), True),
            StructField("track_genre", StringType(), True),
            StructField("track_picture_url", StringType(), True),
            StructField("time", TimestampType(), True),
        ]
    )

    logs_df = (
        spark.readStream.format("kafka") 
            .option("kafka.bootstrap.servers", "172.31.15.209:9092") 
            .option("subscribe","log_topic") 
            .option("startingOffsets", "earliest") # "latest" 
            .option("failOnDataLoss", "false") 
            .option("timestampFormat", "yyyy-MM-dd HH:mm:ss")
            .load()
    )
    
    
    # logs_df.writeStream.format("console").outputMode("append").start().awaitTermination()
    today_date = datetime.now().date()
    
    value_df = (
        logs_df.withColumn(
                "value", 
                F.from_json(F.col("value").cast("string"), schema = schema))
                # .withColumn("timestamp",col("timestamp").cast("date"))
            .select(F.col("value.*"), F.col("timestamp"))  #, F.col("timestamp")
            .filter(F.col("time").cast("date") == today_date)
    )
    
    # value_df = value_df.withColumn("time_in_seoul", F.from_utc_timestamp(F.col("time"), "Asia/Seoul"))

    # value_df.writeStream.format("console").outputMode("append").start().awaitTermination()
    # track_agg_hours = (
    #     value_df.withWatermark("time", "10 minutes") # 1 hour
    #         .groupby(F.window(F.col("time"), "10 minutes").alias("time"), F.col("artist"), F.col("track"), F.col("track_picture_url"))
    #         .agg(F.count("track").alias("track_count"))
    #         .select(
    #             F.col("track_picture_url"),
    #             F.col("artist"),
    #             F.col("track"),
    #             F.col("track_count"),
    #             F.col("time").getField("start").alias("start"),
    #             F.col("time").getField("end").alias("end"),
    #         )
    # )
    track_agg_hours = (
        value_df # .withColumn("timestamp", F.from_utc_timestamp(F.col("time"), "Asia/Seoul"))
            .withWatermark("timestamp", "1 hour")
            .groupby(
                F.window(F.col("timestamp"),"1 hour").alias("time"),
                F.col("artist"),
                # F.col("track_id"),
                F.col("track"),
                F.col("track_picture_url")
            )
            .agg(F.count("track").alias("track_count")) 
            .select(
                F.col("track_picture_url"),
                F.col("artist"),
                F.col("track"),
                # F.col("track_id"),
                F.col("track_count"),
                F.col("time").getField("start").alias("start"),
                F.col("time").getField("end").alias("end"),
                
            )
            # .orderBy("start", F.col("track_count").desc())
    )

    # track_agg_hours.writeStream.format("console").outputMode("complete").start().awaitTermination()
    # +--------------------+--------------+--------------------+-----------+-------------------+-------------------+
    # |   track_picture_url|        artist|               track|track_count|              start|                end|
    # +--------------------+--------------+--------------------+-----------+-------------------+-------------------+
    # |https://i.scdn.co...|Axel Johansson|Forever (feat. El...|          9|2023-12-28 15:00:00|2023-12-28 16:00:00|
    # |https://i.scdn.co...|           EXO|      The First Snow|          4|2023-12-28 15:00:00|2023-12-28 16:00:00|
    # +--------------------+--------------+--------------------+-----------+-------------------+-------------------+
    
    # (
    #     track_agg_hours.writeStream
    #         .format("kafka")
    #         .option("checkpointLocation", "/home/ubuntu/Data_Engineering/kafka-spark-streaming/.checkpoint")
    #         .option("kafka.bootstrap.servers", "172.31.15.209:9092") 
    #         .option("topic", "track_agg_hours")
    #         .outputMode("complete")
    #         .start().awaitTermination() 
    # )
    # (
    #     track_agg_hours.writeStream
    #         .format("csv")
    #         .option("path", "/home/ubuntu/Data_Engineering/kafka-spark-streaming/output")
    #         .option("checkpointLocation", ".checkpoint") 
    #         .trigger(processingTime="100 seconds")  # 100 seconds 1 hour 30 minutes
    #         .outputMode("append")
    #         .start().awaitTermination()       
    # )
    
    
    (
        track_agg_hours.writeStream
            .format("mongodb")
            .option("checkpointLocation", "/home/ubuntu/Data_Engineering/kafka-spark-streaming/.checkpoint")
            .option("spark.mongodb.connection.uri", "mongodb://4.5HZ:12345@127.0.0.1:27017/")
            .option("spark.mongodb.database", "log_db")
            .option("spark.mongodb.collection", "streaming_track_agg") # stream_track_agg
            .trigger(processingTime="100 seconds")
            .outputMode("complete") # append
            .start()
            .awaitTermination()
    )
    