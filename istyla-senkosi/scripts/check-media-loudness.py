"""Check measured output levels and page soundtrack references."""
from pathlib import Path
import json,re
ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "src/assets"
report = json.loads((ASSETS / "normalized-audio/loudness-report.json").read_text(encoding="utf-8"))
assert report, "No soundtrack measurements"
for track in report:
    assert abs(track["normalized_lufs"] + 16) <= .7, track
    assert track["true_peak"] <= -.5, track
    assert (ASSETS / track["output"]).is_file(), track
for page in (ROOT / "src/pages").glob("*.jsx"):
    for reference in re.findall(r'"(../assets/normalized-audio/[^"\n]+)"', page.read_text(encoding="utf-8")):
        assert (page.parent / reference).is_file(), reference
print(f"Verified {len(report)} soundtrack copies within 0.7 LU of -16 LUFS, with peak headroom and valid page imports.")
