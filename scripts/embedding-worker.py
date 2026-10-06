"""Local-only multilingual embeddings over JSON lines; no religious generation."""
import contextlib
import json
import os
import sys

os.environ["HF_HUB_OFFLINE"] = "1"
os.environ["TRANSFORMERS_OFFLINE"] = "1"
os.environ["TOKENIZERS_PARALLELISM"] = "false"
with contextlib.redirect_stdout(sys.stderr):
    from sentence_transformers import SentenceTransformer
    model = SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2", local_files_only=True, device="cpu")
for line in sys.stdin:
    request = {}
    try:
        request = json.loads(line)
        texts = request["texts"]
        if not isinstance(texts, list) or len(texts) > 100 or any(not isinstance(text, str) or len(text) > 5000 for text in texts):
            raise ValueError("Invalid embedding input")
        with contextlib.redirect_stdout(sys.stderr):
            vectors = model.encode(texts, normalize_embeddings=True, show_progress_bar=False).tolist()
        print(json.dumps({"id": request["id"], "vectors": vectors}), flush=True)
    except Exception as error:
        print(json.dumps({"id": request.get("id"), "error": type(error).__name__}), flush=True)
