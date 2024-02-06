from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from recommend.collaboration_recommend_2 import recommend_music  

# DAG 설정
default_args = {
    'start_date': datetime(2023, 12, 31),
}

with DAG(
    dag_id='music_collaboration_recommend_2_dag', 
    default_args=default_args,
    description='A simple music collaboration_recommend_2',
    schedule_interval="0 4 * * 1-5", 
    catchup=False,
) as dag:

    task = PythonOperator(
        task_id='recommend_music_2',
        python_callable=recommend_music,
    )
