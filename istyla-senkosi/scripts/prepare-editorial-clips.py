"""Create web-ready, loudness-matched copies; preserve original documentary assets."""
from pathlib import Path
import concurrent.futures, json, subprocess
ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "src/assets"
OUT = ASSETS / "edited-clips"
CLIPS = [
 ("swenka-intro", "Chapter 1_Swenka/Video/Swenka_Intro_Video.mp4", None),
 ("swenka-interview", "Chapter 1_Swenka/Video/Swenka_Explainer.mp4", None),
 ("pantsula-movement", "Chapter 2_Pantsula/Video/Pantsula_1.mov", None),
 ("pantsula-performance", "Chapter 2_Pantsula/Video/Pantsula_2.mov", None),
 ("skhothane-expression", "Chapter 3_Skothane/Video/Intro Video - Skothane.mp4", 20),
 ("skhothane-voices", "video-clips/skhothane-voices.mp4", 20),
]
def run_clip(item):
 name, source, duration = item
 trim = ["-t", str(duration)] if duration else []
 src = str(ASSETS / source)
 analysis = subprocess.run(["ffmpeg", "-hide_banner", "-i", src, *trim, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True, check=True)
 stats, _ = json.JSONDecoder().raw_decode(analysis.stderr[analysis.stderr.rfind("{"):])
 af = ("loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=" + stats["input_i"] + ":measured_TP=" + stats["input_tp"] + ":measured_LRA=" + stats["input_lra"] + ":measured_thresh=" + stats["input_thresh"] + ":offset=" + stats["target_offset"] + ":linear=true:print_format=json")
 result = subprocess.run(["ffmpeg", "-hide_banner", "-y", "-i", src, *trim, "-map", "0:v:0", "-map", "0:a:0", "-vf", "scale=1280:-2:force_original_aspect_ratio=decrease", "-c:v", "libx264", "-preset", "fast", "-crf", "22", "-pix_fmt", "yuv420p", "-af", af, "-c:a", "aac", "-b:a", "160k", "-ar", "48000", "-movflags", "+faststart", str(OUT / (name + ".mp4"))], capture_output=True, text=True, check=True)
 measured, _ = json.JSONDecoder().raw_decode(result.stderr[result.stderr.rfind("{"):])
 print(name, "ready", measured["output_i"], "LUFS", flush=True)
 return {"name": name, "source": source, "duration_limit": duration, "input": stats, "output": measured}
if __name__ == "__main__":
 OUT.mkdir(exist_ok=True)
 with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
  report = list(pool.map(run_clip, CLIPS))
 (OUT / "audio-report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
