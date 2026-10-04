from fastapi import FastAPI
from database import create_table, add_task, get_tasks, complete_task, delete_task

app = FastAPI()

# Create database table when the server starts
create_table()


@app.get("/")
def home():
    return {"message": "Voice-to-Task Assistant backend is running!"}


@app.get("/tasks")
def read_tasks():
    return get_tasks()


@app.post("/tasks")
def create_task(
    title: str,
    due_date: str = None,
    due_time: str = None,
    priority: str = "medium"
):
    add_task(title, due_date, due_time, priority)
    return {"message": "Task created successfully"}


@app.put("/tasks/{task_id}/complete")
def mark_task_complete(task_id: int):
    complete_task(task_id)
    return {"message": "Task completed successfully"}


@app.delete("/tasks/{task_id}")
def remove_task(task_id: int):
    delete_task(task_id)
    return {"message": "Task deleted successfully"}