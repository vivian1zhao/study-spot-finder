from config.db import get_db


def log_action(
    user_id,
    action,
    table_name,
    details,
    username=None
):
    db = get_db()
    cursor = db.cursor()

    try:
        if username is None and user_id is not None:
            cursor.execute(
                """
                SELECT username
                FROM Users
                WHERE user_id = %s
                """,
                (user_id,)
            )

            result = cursor.fetchone()

            if result:
                username = result[0]

        cursor.execute(
            """
            INSERT INTO audit_log (
                user_id,
                username,
                action,
                table_name,
                details
            )
            VALUES (%s, %s, %s, %s, %s)
            """,
            (
                user_id,
                username,
                action,
                table_name,
                details
            )
        )

        db.commit()

    except Exception:
        db.rollback()
        raise

    finally:
        cursor.close()
        db.close()