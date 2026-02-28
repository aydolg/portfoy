from urllib.request import urlopen

BASE = "http://127.0.0.1:8000"


def fetch(path: str) -> str:
    with urlopen(f"{BASE}{path}", timeout=5) as response:
        if response.status != 200:
            raise RuntimeError(f"{path} status={response.status}")
        return response.read().decode("utf-8", errors="ignore")


def assert_contains(content: str, text: str, path: str) -> None:
    if text not in content:
        raise AssertionError(f"'{text}' bulunamadı: {path}")


def main() -> None:
    index_html = fetch("/index.html")
    assert_contains(index_html, "Portföy Raporunu Aç", "/index.html")

    report_html = fetch("/rapor.html")
    assert_contains(report_html, "portfolio-summary", "/rapor.html")
    assert_contains(report_html, "stock-performance", "/rapor.html")
    assert_contains(report_html, "real-return-analysis", "/rapor.html")

    print("Smoke test başarılı.")


if __name__ == "__main__":
    main()
