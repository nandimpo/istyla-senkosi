"""Make loudness-matched soundtrack copies, preserving source recordings."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import json, subprocess
ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "src/assets"
SOURCE = ASSETS / "audio/New Music"
OUT = ASSETS / "normalized-audio"
TARGET = "loudnorm=I=-16:TP=-2:LRA=9"
def stats(stderr):
    return json.JSONDecoder().raw_decode(stderr[stderr.rfind("{"):])[0]
def process(source):
    relative = source.relative_to(SOURCE)
    output = OUT / relative.with_suffix(".mp3")
    output.parent.mkdir(parents=True, exist_ok=True)
    analysis = subprocess.run(["ffmpeg", "-hide_banner", "-nostdin", "-i", str(source), "-vn", "-af", TARGET + ":print_format=json", "-f", "null", "-"], capture_output=True, text=True, check=True)
    measured = stats(analysis.stderr)
    af = TARGET + ":measured_I=" + measured["input_i"] + ":measured_TP=" + measured["input_tp"] + ":measured_LRA=" + measured["input_lra"] + ":measured_thresh=" + measured["input_thresh"] + ":offset=" + measured["target_offset"] + ":linear=true"
    subprocess.run(["ffmpeg", "-hide_banner", "-nostdin", "-y", "-i", str(source), "-vn", "-af", af, "-c:a", "libmp3lame", "-b:a", "192k", "-ar", "48000", str(output)], capture_output=True, text=True, check=True)
    verification = subprocess.run(["ffmpeg", "-hide_banner", "-nostdin", "-i", str(output), "-af", TARGET + ":print_format=json", "-f", "null", "-"], capture_output=True, text=True, check=True)
    final = stats(verification.stderr)
    print(str(relative) + " | " + measured["input_i"] + " -> " + final["input_i"] + " LUFS", flush=True)
    return {"source":str(relative), "output":str(output.relative_to(ASSETS)), "original_lufs":float(measured["input_i"]), "normalized_lufs":float(final["input_i"]), "true_peak":float(final["input_tp"])}
if __name__ == "__main__":
    files = sorted(p for p in SOURCE.rglob("*") if p.suffix.lower() in (".mp3", ".wav", ".m4a", ".ogg"))
    with ThreadPoolExecutor(max_workers=2) as pool:
        report = list(pool.map(process, files))
    (OUT / "loudness-report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    print("Verified", len(report), "normalized tracks", flush=True)
