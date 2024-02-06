from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from recommend.collaboration_recommend_1 import recommend_music  

default_args = {
    'start_date': datetime(2023, 12, 31),
}

with DAG(
    dag_id='collaboration_recommend_1_dag', 
    default_args=default_args,
    description='A simple DAG to collaboration_recommend_1',
    schedule_interval='10 0 * * 1-5', 
    catchup=False,
) as dag:

    run_recommend_music = PythonOperator(
        task_id='run_recommend_music',
        python_callable=recommend_music,
    )
