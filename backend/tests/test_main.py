import sqlite3

import pytest
from fastapi.testclient import TestClient

import database
import main


def _sample_result():
    return {
        "question": "what is python",
        "report": "Python is a language [1].",
        "sources": [{"title": "Python", "url": "https://python.org"}],
        "steps": [
            {
                "iteration": 1,
                "tool": "search_web",
                "arguments": {"query": "python"},
            }
        ],
    }


@pytest.fixture
def client(tmp_path, monkeypatch):
    monkeypatch.setattr(database, "DB_PATH", str(tmp_path / "api.db"))
    with TestClient(main.app) as test_client:
        yield test_client


def test_health_endpoint(client):
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_research_endpoint_returns_result_and_persists(client, monkeypatch):
    monkeypatch.setattr(main, "research", lambda question: _sample_result())

    response = client.post("/research", json={"question": "what is python"})

    assert response.status_code == 200
    body = response.json()
    assert body["task_id"] == 1
    assert body["question"] == "what is python"
    assert body["report"] == "Python is a language [1]."
    assert body["sources"] == _sample_result()["sources"]

    with sqlite3.connect(database.DB_PATH) as db:
        count = db.execute("SELECT COUNT(*) FROM research_tasks").fetchone()[0]
    assert count == 1


@pytest.mark.parametrize("question", ["", "hi", "a" * 501])
def test_research_endpoint_rejects_invalid_questions(client, monkeypatch, question):
    monkeypatch.setattr(main, "research", lambda question: _sample_result())

    response = client.post("/research", json={"question": question})

    assert response.status_code == 422


def test_research_endpoint_returns_500_when_agent_fails(client, monkeypatch):
    def boom(question):
        raise RuntimeError("model unavailable")

    monkeypatch.setattr(main, "research", boom)

    response = client.post("/research", json={"question": "what is python"})

    assert response.status_code == 500
    assert response.json()["detail"] == "Research failed. Check backend logs."


def test_cors_preflight_allows_frontend_origin(client):
    response = client.options(
        "/research",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "POST",
        },
    )

    assert response.status_code == 200
    assert (
        response.headers["access-control-allow-origin"] == "http://localhost:3000"
    )
