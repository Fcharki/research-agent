import search


class FakeDDGS:
    def __init__(self, results):
        self._results = results

    def __enter__(self):
        return self

    def __exit__(self, *exc):
        return False

    def text(self, query, max_results=5):
        self.query = query
        self.max_results = max_results
        return list(self._results)


def test_search_web_maps_ddgs_fields(monkeypatch):
    fake = FakeDDGS([{"title": "T", "href": "https://x", "body": "B"}])
    monkeypatch.setattr(search, "DDGS", lambda: fake)

    results = search.search_web("python")

    assert results == [{"title": "T", "url": "https://x", "snippet": "B"}]


def test_search_web_defaults_missing_fields(monkeypatch):
    fake = FakeDDGS([{}])
    monkeypatch.setattr(search, "DDGS", lambda: fake)

    assert search.search_web("q") == [{"title": "", "url": "", "snippet": ""}]


def test_search_web_passes_query_and_max_results(monkeypatch):
    fake = FakeDDGS([])
    monkeypatch.setattr(search, "DDGS", lambda: fake)

    search.search_web("python", max_results=3)

    assert fake.query == "python"
    assert fake.max_results == 3
