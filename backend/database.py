import json
import os
import sqlite3

DB_PATH = os.getenv("DB_PATH", "research.db")


def init_db():
    with sqlite3.connect(DB_PATH) as db:
        db.executescript("""
            CREATE TABLE IF NOT EXISTS research_tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                question TEXT NOT NULL,
                report TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS sources (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                task_id INTEGER NOT NULL,
                title TEXT,
                url TEXT NOT NULL,
                FOREIGN KEY(task_id) REFERENCES research_tasks(id)
            );

            CREATE TABLE IF NOT EXISTS agent_steps (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                task_id INTEGER NOT NULL,
                iteration INTEGER,
                tool TEXT,
                arguments TEXT,
                FOREIGN KEY(task_id) REFERENCES research_tasks(id)
            );
        """)


def save_research(result: dict) -> int:
    with sqlite3.connect(DB_PATH) as db:
        cursor = db.execute(
            "INSERT INTO research_tasks (question, report) "
            "VALUES (?, ?)",
            (result["question"], result["report"]),
        )
        task_id = cursor.lastrowid

        seen_urls = set()
        for source in result["sources"]:
            url = source.get("url")
            if not url or url in seen_urls:
                continue
            seen_urls.add(url)

            db.execute(
                "INSERT INTO sources (task_id, title, url) "
                "VALUES (?, ?, ?)",
                (task_id, source.get("title", ""), url),
            )

        for step in result["steps"]:
            db.execute(
                "INSERT INTO agent_steps "
                "(task_id, iteration, tool, arguments) "
                "VALUES (?, ?, ?, ?)",
                (
                    task_id,
                    step["iteration"],
                    step["tool"],
                    json.dumps(step["arguments"]),
                ),
            )

        return task_id
