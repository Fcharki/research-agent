import json
import sqlite3

import database


def _use_temp_db(tmp_path, monkeypatch):
    db_path = tmp_path / "test.db"
    monkeypatch.setattr(database, "DB_PATH", str(db_path))
    return db_path


def test_init_db_creates_expected_tables(tmp_path, monkeypatch):
    db_path = _use_temp_db(tmp_path, monkeypatch)

    database.init_db()

    with sqlite3.connect(db_path) as db:
        tables = {
            row[0]
            for row in db.execute(
                "SELECT name FROM sqlite_master WHERE type = 'table'"
            )
        }

    assert {"research_tasks", "sources", "agent_steps"} <= tables


def test_init_db_is_idempotent(tmp_path, monkeypatch):
    _use_temp_db(tmp_path, monkeypatch)

    database.init_db()
    database.init_db()


def test_save_research_persists_rows_and_dedupes_sources(tmp_path, monkeypatch):
    db_path = _use_temp_db(tmp_path, monkeypatch)
    database.init_db()

    result = {
        "question": "what is python",
        "report": "Python is a language [1].",
        "sources": [
            {"title": "A", "url": "https://a"},
            {"title": "A duplicate", "url": "https://a"},
            {"title": "B", "url": "https://b"},
            {"title": "no url", "url": ""},
        ],
        "steps": [
            {"iteration": 1, "tool": "search_web", "arguments": {"query": "python"}},
            {"iteration": 2, "tool": "fetch_page", "arguments": {"url": "https://a"}},
        ],
    }

    task_id = database.save_research(result)

    assert task_id == 1

    with sqlite3.connect(db_path) as db:
        task = db.execute(
            "SELECT question, report FROM research_tasks"
        ).fetchone()
        assert task == ("what is python", "Python is a language [1].")

        urls = [row[0] for row in db.execute("SELECT url FROM sources ORDER BY id")]
        assert urls == ["https://a", "https://b"]

        steps = db.execute(
            "SELECT tool, arguments FROM agent_steps ORDER BY id"
        ).fetchall()
        assert [step[0] for step in steps] == ["search_web", "fetch_page"]
        assert json.loads(steps[0][1]) == {"query": "python"}
