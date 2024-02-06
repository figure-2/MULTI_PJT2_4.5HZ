from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from my_package.gmm import gmm_model 

default_args = {
    "start_date" : datetime(2023, 12, 21)
}

with DAG(
    dag_id = "music_rec_pipline",
    schedule_interval = "10 10 * * *", # @hourly
    default_args = default_args,
    tags = ["music_rec_pipline","GMM"],
    catchup = False
) as dag:

    gmm_model_result = PythonOperator(
        task_id='gmm_model_result',
        python_callable=gmm_model,
    )
