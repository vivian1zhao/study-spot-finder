from config.db import get_db

def log_action(user_id, action, table_name, details):
    db = get_db()
    cursor = db.cursor()

    cursor.execute("SELECT username FROM Users WHERE user_id = %s", (user_id,))
    result = cursor.fetchone()
    username = result[0] if result else None

    # audit log entries
    cursor.execute("""
        INSERT INTO audit_log (user_id, username, action, table_name, details)
        VALUES (%s, %s, %s, %s, %s)
    """, (user_id, username, action, table_name, details))

    db.commit()
