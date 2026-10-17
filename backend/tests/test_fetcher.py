import httpx

import fetcher


class FakeResponse:
    def __init__(self, text="", content_type="text/html", url="https://example.com"):
        self.text = text
        self.headers = {"content-type": content_type}
        self.url = url

    def raise_for_status(self):
        return None


def test_fetch_page_rejects_non_http_urls():
    assert fetcher.fetch_page("ftp://example.com/file") == {
        "error": "Only HTTP(S) URLs are allowed."
    }


def test_fetch_page_extracts_title_and_visible_text(monkeypatch):
    html = (
        "<html><head><title> Hi </title></head>"
        "<body><nav>skip</nav><p>Hello <b>world</b></p>"
        "<script>evil()</script></body></html>"
    )
    monkeypatch.setattr(fetcher.httpx, "get", lambda *a, **k: FakeResponse(html))

    result = fetcher.fetch_page("https://example.com")

    assert result["title"] == "Hi"
    assert "Hello world" in result["content"]
    assert "evil" not in result["content"]
    assert result["url"] == "https://example.com"


def test_fetch_page_rejects_non_html_content(monkeypatch):
    monkeypatch.setattr(
        fetcher.httpx,
        "get",
        lambda *a, **k: FakeResponse("{}", content_type="application/json"),
    )

    assert fetcher.fetch_page("https://example.com/data.json") == {
        "error": "URL is not an HTML page."
    }


def test_fetch_page_returns_error_on_http_failure(monkeypatch):
    def boom(*args, **kwargs):
        raise httpx.HTTPError("connection refused")

    monkeypatch.setattr(fetcher.httpx, "get", boom)

    assert fetcher.fetch_page("https://example.com") == {
        "error": "connection refused"
    }
