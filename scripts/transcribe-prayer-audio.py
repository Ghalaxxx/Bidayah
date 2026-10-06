"""Align a narration of the approved prayer booklet for source comparison, not approval."""
import json
from pathlib import Path
from faster_whisper import WhisperModel

root = Path(__file__).resolve().parents[1]
model = WhisperModel("base", device="cpu", compute_type="int8", local_files_only=True)
segments, _ = model.transcribe(str(root / "data/media-review/prayer-book-narration.mp3"), language="ar", beam_size=5, word_timestamps=True)
rows = []
for s in segments:
    row = {"start": s.start, "end": s.end, "text": s.text, "words": [{"start": w.start, "end": w.end, "word": w.word} for w in s.words]}
    rows.append(row)
    print(f"{s.start:.2f}-{s.end:.2f} {s.text}", flush=True)
(root / "data/media-review/prayer-narration-alignment.json").write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding="utf-8")
