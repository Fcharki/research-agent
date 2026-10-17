import agent
from agent import _build_evidence, _dedupe_sources, _run_tool, research


def _sequenced_chat(responses, calls):
    iterator = iter(responses)

    def chat_with_llm(messages, tools=None):
        calls.append(messages)
        return next(iterator)

    return chat_with_llm


def _patch_tools(monkeypatch, **tools):
    monkeypatch.setattr(agent, "AVAILABLE_TOOLS", tools)


def test_research_runs_tool_loop_and_writes_report(
    monkeypatch, tool_response, text_response
):
    calls = []
    responses = [
        tool_response("search_web", {"query": "python"}),
        text_response(""),  # model stops requesting tools
        text_response("Python is a language [1]."),
    ]
    monkeypatch.setattr(agent, "chat_with_llm", _sequenced_chat(responses, calls))
    _patch_tools(
        monkeypatch,
        search_web=lambda query: [
            {"title": "Python", "url": "https://python.org", "snippet": "..."}
        ],
        fetch_page=lambda url: {"url": url, "content": "body"},
    )

    result = research("what is python")

    assert result["question"] == "what is python"
    assert result["report"] == "Python is a language [1]."
    assert [source["url"] for source in result["sources"]] == [
        "https://python.org"
    ]
    assert result["steps"] == [
        {
            "iteration": 1,
            "tool": "search_web",
            "arguments": {"query": "python"},
        }
    ]
    assert len(calls) == 3


def test_research_collects_fetched_pages_as_sources(
    monkeypatch, tool_response, text_response
):
    calls = []
    responses = [
        tool_response("fetch_page", {"url": "https://example.com"}),
        text_response(""),
        text_response("Report [1]."),
    ]
    monkeypatch.setattr(agent, "chat_with_llm", _sequenced_chat(responses, calls))
    _patch_tools(
        monkeypatch,
        fetch_page=lambda url: {
            "url": url,
            "title": "Example",
            "content": "Hello world",
        },
    )

    result = research("example")

    assert result["sources"] == [
        {"title": "Example", "url": "https://example.com", "content": "Hello world"}
    ]
    assert result["steps"][0]["tool"] == "fetch_page"


def test_research_falls_back_to_search_when_model_never_calls_a_tool(
    monkeypatch, text_response
):
    calls = []
    responses = [
        text_response("I cannot do that."),
        text_response("Report [1]."),
    ]
    monkeypatch.setattr(agent, "chat_with_llm", _sequenced_chat(responses, calls))
    _patch_tools(
        monkeypatch,
        search_web=lambda query: [
            {"title": "Result", "url": "https://result.example", "snippet": "s"}
        ],
    )

    result = research("python")

    assert [source["url"] for source in result["sources"]] == [
        "https://result.example"
    ]
    assert result["steps"] == [
        {
            "iteration": 1,
            "tool": "search_web",
            "arguments": {"query": "python"},
        }
    ]
    assert len(calls) == 2


def test_research_returns_guard_message_when_there_is_no_evidence(
    monkeypatch, text_response
):
    calls = []
    responses = [text_response("nothing found")]
    monkeypatch.setattr(agent, "chat_with_llm", _sequenced_chat(responses, calls))
    _patch_tools(monkeypatch, search_web=lambda query: [])

    result = research("obscure question")

    assert result["sources"] == []
    assert "No sources could be retrieved" in result["report"]
    # The final writing call must not happen without evidence.
    assert len(calls) == 1


def test_research_limits_number_of_sources(monkeypatch, tool_response, text_response):
    calls = []
    responses = [
        tool_response("search_web", {"query": "many"}),
        text_response(""),
        text_response("Report."),
    ]
    monkeypatch.setattr(agent, "chat_with_llm", _sequenced_chat(responses, calls))
    _patch_tools(
        monkeypatch,
        search_web=lambda query: [
            {"title": f"T{i}", "url": f"https://example.com/{i}", "snippet": "s"}
            for i in range(20)
        ],
    )

    result = research("many sources")

    assert len(result["sources"]) == agent.MAX_SOURCES


def test_dedupe_sources_drops_missing_and_repeated_urls():
    sources = [
        {"url": "https://a"},
        {"url": "https://a"},
        {"url": "https://b"},
        {"title": "no url"},
    ]

    assert [source["url"] for source in _dedupe_sources(sources)] == [
        "https://a",
        "https://b",
    ]


def test_build_evidence_numbers_sources_and_normalises_whitespace():
    evidence = _build_evidence(
        [
            {"title": "First", "url": "https://a", "snippet": "hello   world"},
            {"url": "https://b", "content": "second"},
        ]
    )

    assert evidence.startswith("[1] First\nURL: https://a\nhello world")
    assert "[2] https://b" in evidence


def test_build_evidence_truncates_long_source_text():
    long_text = "z" * (agent.SOURCE_TEXT_LIMIT + 500)

    evidence = _build_evidence(
        [{"title": "T", "url": "https://a", "snippet": long_text}]
    )

    assert evidence.count("z") == agent.SOURCE_TEXT_LIMIT
    assert len(evidence) <= agent.MAX_EVIDENCE_CHARS


def test_run_tool_reports_unknown_tool(monkeypatch):
    _patch_tools(monkeypatch, search_web=lambda query: [])

    assert _run_tool("missing", {}) == {"error": "Unknown tool"}


def test_run_tool_captures_exceptions(monkeypatch):
    def boom():
        raise RuntimeError("kaboom")

    _patch_tools(monkeypatch, boom=boom)

    assert _run_tool("boom", {}) == {"error": "kaboom"}
