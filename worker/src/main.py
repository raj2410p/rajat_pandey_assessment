import os
import json
import time
import redis
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()

# Configuration
REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379')
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/ai-task-platform')
QUEUE_NAME = 'task_queue'

# Clients
redis_client = redis.from_url(REDIS_URL)
mongo_client = MongoClient(MONGO_URI)
db = mongo_client.get_database()
tasks_collection = db.tasks

def process_task(task_data):
    task_id = task_data['taskId']
    input_text = task_data['inputText']
    operation = task_data['operation']
    
    print(f"Processing task {task_id}: {operation}")
    
    # Update status to running
    tasks_collection.update_one(
        {'_id': ObjectId(task_id)},
        {'$set': {'status': 'running'}, '$push': {'logs': 'Worker started processing'}}
    )
    
    try:
        result = None
        if operation == 'uppercase':
            result = input_text.upper()
        elif operation == 'lowercase':
            result = input_text.lower()
        elif operation == 'reverse':
            result = input_text[::-1]
        elif operation == 'word_count':
            result = len(input_text.split())
        else:
            raise ValueError(f"Unknown operation: {operation}")
        
        # Update status to success
        tasks_collection.update_one(
            {'_id': ObjectId(task_id)},
            {
                '$set': {
                    'status': 'success',
                    'result': result
                },
                '$push': {'logs': f'Operation {operation} completed successfully'}
            }
        )
        print(f"Task {task_id} success")
        
    except Exception as e:
        print(f"Task {task_id} failed: {str(e)}")
        tasks_collection.update_one(
            {'_id': ObjectId(task_id)},
            {
                '$set': {'status': 'failed'},
                '$push': {'logs': f'Error: {str(e)}'}
            }
        )

def worker():
    print("Worker started. Listening for tasks...")
    while True:
        try:
            # BLPOP blocks until a task is available
            task = redis_client.blpop(QUEUE_NAME, timeout=30)
            if task:
                _, data = task
                task_data = json.loads(data)
                process_task(task_data)
        except Exception as e:
            print(f"Worker error: {str(e)}")
            time.sleep(5)

if __name__ == "__main__":
    worker()
