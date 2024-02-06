from datetime import datetime
from airflow import DAG

from airflow.providers.mysql.operators.mysql import MySqlOperator
from airflow.providers.apache.spark.operators.spark_submit import SparkSubmitOperator

# from airflow.operators.bash import BashOperator

from my_package.save import read_csv_and_store_in_mysql
from airflow.operators.python import PythonOperator

default_args = {
    "start_date" : datetime(2023, 12, 14)
}

with DAG(
    dag_id = "django-log-pipeline",
    schedule_interval = "30 9 * * *", # @hourly
    default_args = default_args,
    tags = ["django","logs"],
    catchup = False
) as dag:
    
    
    # 1. 데이터 수집/전처리
    preprocess = SparkSubmitOperator(
        task_id = 'preprocess',
        conn_id = 'spark_local',
        application = "/home/ubuntu/airflow/dags/preprocess.py"
    )

    # 2. 집계
    aggregate = SparkSubmitOperator(
        task_id = 'aggregate',
        conn_id = 'spark_local',
        application = "/home/ubuntu/airflow/dags/aggregate.py"
    )
    # 3. DB 적재
    task_read_csv_and_store_in_mysql = PythonOperator(
        task_id='read_csv_and_store_in_mysql',
        python_callable=read_csv_and_store_in_mysql

    )
    
    # log 집계 파이프라인
    preprocess >> aggregate >> task_read_csv_and_store_in_mysql

    