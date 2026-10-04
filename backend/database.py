import sqlite3

DATABASE_NAME = "tasks.db"


def connect_db():
    return sqlite3.connect(DATABASE_NAME)


def create_table():
    connection = connect_db()
    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            due_date TEXT,
            due_time TEXT,
            priority TEXT DEFAULT 'medium',
            status TEXT DEFAULT 'pending'
        )
    """)

    connection.commit()
    connection.close()


def add_task(title, due_date=None, due_time=None,
             priority="medium", status="pending"):

    connection = connect_db()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO tasks
        (title, due_date, due_time, priority, status)
        VALUES (?, ?, ?, ?, ?)
    """, (title, due_date, due_time, priority, status))

    connection.commit()
    connection.close()


def get_tasks():
    connection = connect_db()
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM tasks")

    tasks = cursor.fetchall()

    connection.close()

    return tasks


def complete_task(task_id):
    connection = connect_db()
    cursor = connection.cursor()

    cursor.execute("""
        UPDATE tasks
        SET status = 'completed'
        WHERE id = ?
    """, (task_id,))

    connection.commit()
    connection.close()


def delete_task(task_id):
    connection = connect_db()
    cursor = connection.cursor()

    cursor.execute("""
        DELETE FROM tasks
        WHERE id = ?
    """, (task_id,))

    connection.commit()
    connection.close()


if __name__ == "__main__":
    create_table()
    print("Database and tasks table created successfully!")