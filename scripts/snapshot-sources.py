"""Capture only the approved pack; extraction is evidence, not human signoff."""
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import Request, urlopen

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "data/sources/review"
OUTPUT.mkdir(parents=True, exist_ok=True)
registry = json.loads((ROOT / "public/data/sources/sources.json").read_text(encoding="utf-8"))
for source in registry:
    try:
        request = Request(source["url"], headers={"User-Agent": "Bidayah-source-review/1.0"})
        with urlopen(request, timeout=45) as response:
            raw = response.read()
        soup = BeautifulSoup(raw, "html.parser")
        for element in soup(["script", "style", "nav", "header", "footer"]):
            element.decompose()
        content = soup.select_one("#full_description_content") or soup.select_one("main") or soup.body
        text = content.get_text("\n", strip=True)
        artifact = {"sourceId": source["id"], "url": source["url"], "capturedAt": datetime.now(timezone.utc).isoformat(), "sha256": hashlib.sha256(raw).hexdigest(), "status": "SOURCE_CAPTURE_NOT_HUMAN_APPROVAL", "text": text}
        (OUTPUT / f'{source["id"]}.json').write_text(json.dumps(artifact, ensure_ascii=False, indent=2), encoding="utf-8")
        print(source["id"], "captured", len(text))
    except Exception as error:
        print(source["id"], "UNAVAILABLE", type(error).__name__)
