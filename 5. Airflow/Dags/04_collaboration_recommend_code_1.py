from datetime import datetime
from airflow import DAG
from airflow.operators.python import PythonOperator
from recommend.collaboration_recommend_code_1 import collaboration_recommend_code_1  

default_args = {
    'start_date': datetime(2023, 12, 31),
}

with DAG(
    dag_id='collaboration_recommend_code_1', 
    default_args=default_args,
    description='A simple DAG to collaboration_recommend_code_1',
    schedule_interval='0 0 * * 6',  
    catchup=False,
) as dag:

    run_recommend_music_code_1 = PythonOperator(
        task_id='run_recommend_music_code_1',
        python_callable=collaboration_recommend_code_1,
    )