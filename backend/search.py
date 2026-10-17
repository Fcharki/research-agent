from ddgs import DDGS


def search_web(query: str, max_results: int = 5):
    with DDGS() as ddgs:
        results = list(
            ddgs.text(query, max_results=max_results)
        )

    return [
        {
            "title": item.get("title", ""),
            "url": item.get("href", ""),
            "snippet": item.get("body", ""),
        }
        for item in results
    ]
