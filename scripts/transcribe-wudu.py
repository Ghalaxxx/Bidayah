"""Produce a timed review transcript from the approved official video; not religious approval."""
import json
from pathlib import Path
from urllib.request import urlretrieve
from faster_whisper import WhisperModel

ROOT = Path(__file__).resolve().parents[1]
REVIEW = ROOT / "data" / "sources" / "review"
REVIEW.mkdir(parents=True, exist_ok=True)
video = REVIEW / "prh-wudu-official.mp4"
url = "https://risala.prh.gov.sa/storage/contents/514/ar_sifat_alwoudo_new.mp4"
if not video.exists():
    urlretrieve(url, video)
model = WhisperModel("base", device="cpu", compute_type="int8", local_files_only=True)
segments, info = model.transcribe(str(video), language="ar", beam_size=5)
rows = [{"start": s.start, "end": s.end, "text": s.text} for s in segments]
result = {"sourceId": "prh_wudu_001", "url": url, "status": "NEEDS_RELIGIOUS_REVIEW", "method": "faster-whisper-base Arabic transcription; requires comparison to source audio/video", "segments": rows}
(REVIEW / "wudu-transcript.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
for row in rows:
    print(f"{row['start']:.1f}-{row['end']:.1f} {row['text']}", flush=True)
