import httpx
from bs4 import BeautifulSoup


def fetch_page(url: str) -> dict:
    # Basic validation; add SSRF protections before deployment.
    if not url.startswith(("https://", "http://")):
        return {"error": "Only HTTP(S) URLs are allowed."}

    try:
        response = httpx.get(
            url,
            timeout=10,
            follow_redirects=True,
            headers={"User-Agent": "ResearchAgent/1.0"},
        )
        response.raise_for_status()

        content_type = response.headers.get(
            "content-type", ""
        )
        if "text/html" not in content_type:
            return {"error": "URL is not an HTML page."}

        soup = BeautifulSoup(response.text, "html.parser")

        for tag in soup(["script", "style", "nav", "footer"]):
            tag.decompose()

        text = " ".join(soup.stripped_strings)

        # The 8,000-character limit helps control the amount of text sent 
        # # to your small model. For a real deployment, also block private/internal IP 
        # addresses, validate redirects, and restrict response sizes to prevent SSRF and 
        # resource abuse.

        return {
            "url": str(response.url),
            "title": soup.title.get_text(strip=True)
            if soup.title else "",
            "content": text[:8000],
        }

    except (httpx.HTTPError, ValueError) as exc:
        return {"error": str(exc)}
