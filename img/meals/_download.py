#!/usr/bin/env python3
"""Download free-licensed meal photos from Wikimedia Commons for week-board art."""
import json, re, urllib.parse, urllib.request
from pathlib import Path

OUT = Path(__file__).resolve().parent
OUT.mkdir(parents=True, exist_ok=True)

# Curated Commons file titles (reliable food photos). Fallback search query if title fails.
MEALS = {
  "steak": ("File:Grilled steak.jpg", "grilled steak plate"),
  "chicken": ("File:Grilled chicken breast.jpg", "grilled chicken breast"),
  "burger": ("File:NCI Visuals Food Hamburger.jpg", "hamburger burger plate"),
  "brat": ("File:Bratwurst.jpg", "bratwurst grilled"),
  "pork": ("File:Grilled pork chops.jpg", "grilled pork chops"),
  "pizza": ("File:Eq_it-na_pizza-margherita_sep2005_sml.jpg", "pizza margherita"),
  "sandwich": ("File:Club sandwich.png", "club sandwich"),
  "quesadilla": ("File:Quesadilla 2.jpg", "quesadilla plate"),
  "bowl": ("File:Chicken rice bowl.jpg", "chicken rice bowl"),
  "eggs": ("File:Fried egg, sunny side up.jpg", "fried eggs plate"),
  "plate": ("File:Grilled chicken dinner.jpg", "dinner plate grilled"),
  "leftover": ("File:Leftovers in containers.jpg", "leftover food containers"),
  "grab": ("File:Takeout food.jpg", "takeout food container"),
  "takeout": ("File:Chinese takeout box.jpg", "chinese takeout box"),
  "coffee": ("File:A small cup of coffee.JPG", "cup of coffee"),
  "holiday": ("File:Thanksgiving dinner 2.jpg", "thanksgiving dinner plate"),
}

UA = "CameronMealsBot/1.0 (https://github.com/Burnsted/cameron-meals; educational)"

def api(params):
    q = urllib.parse.urlencode({**params, "format": "json"})
    req = urllib.request.Request(
        f"https://commons.wikimedia.org/w/api.php?{q}",
        headers={"User-Agent": UA},
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)

def info_for_title(title):
    info = api({
        "action": "query",
        "titles": title,
        "prop": "imageinfo",
        "iiprop": "url|size|extmetadata|mime",
        "iiurlwidth": 480,
    })
    pages = info.get("query", {}).get("pages", {})
    for p in pages.values():
        if p.get("missing") is not None:
            return None
        ii = (p.get("imageinfo") or [None])[0]
        if not ii:
            return None
        meta = ii.get("extmetadata") or {}
        lic = (meta.get("LicenseShortName", {}) or {}).get("value") or ""
        artist = (meta.get("Artist", {}) or {}).get("value") or "Unknown"
        artist = re.sub(r"<[^>]+>", "", artist).strip()[:120]
        page_url = f"https://commons.wikimedia.org/wiki/{urllib.parse.quote(title.replace(' ', '_'))}"
        return {
            "title": title,
            "url": ii.get("thumburl") or ii.get("url"),
            "license": lic or "see Commons page",
            "artist": artist,
            "page": page_url,
        }
    return None

def find_file(query):
    data = api({
        "action": "query",
        "list": "search",
        "srsearch": f"{query} filetype:bitmap",
        "srnamespace": 6,
        "srlimit": 10,
    })
    for hit in data.get("query", {}).get("search", []):
        title = hit["title"]
        hitinfo = info_for_title(title)
        if not hitinfo:
            continue
        lic = hitinfo["license"].lower()
        lic_ok = any(x in lic for x in ["cc0", "public domain", "cc by", "cc-by", "pd"])
        if not lic_ok and "creative commons" in lic:
            lic_ok = True
        if not lic_ok:
            continue
        return hitinfo
    return None

def download(url, dest: Path):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        dest.write_bytes(r.read())

def to_webp(src: Path, dest: Path):
    from PIL import Image
    im = Image.open(src).convert("RGB")
    im.thumbnail((320, 320))
    canvas = Image.new("RGB", (320, 320), (245, 245, 245))
    x = (320 - im.size[0]) // 2
    y = (320 - im.size[1]) // 2
    canvas.paste(im, (x, y))
    canvas.save(dest, "WEBP", quality=70, method=4)
    if dest.stat().st_size > 42000:
        canvas.save(dest, "WEBP", quality=55, method=6)

credits = []
for slug, (title, query) in MEALS.items():
    webp = OUT / f"{slug}.webp"
    if webp.exists() and webp.stat().st_size > 2000:
        print("skip", slug)
        credits.append({"slug": slug, "file": webp.name, "status": "existing"})
        continue
    print("fetch", slug)
    hit = None
    try:
        hit = info_for_title(title)
        if hit and not hit.get("url"):
            hit = None
    except Exception as e:
        print("  title err", e)
        hit = None
    if not hit:
        try:
            hit = find_file(query)
        except Exception as e:
            print("  search err", e)
            hit = None
    if not hit:
        print("  FAIL", slug)
        credits.append({"slug": slug, "status": "missing"})
        continue
    raw = OUT / f"_raw_{slug}"
    try:
        download(hit["url"], raw)
        to_webp(raw, webp)
        raw.unlink(missing_ok=True)
        credits.append({
            "slug": slug,
            "file": webp.name,
            "source": hit["page"],
            "author": hit["artist"],
            "license": hit["license"],
            "bytes": webp.stat().st_size,
        })
        print("  ok", webp.name, webp.stat().st_size)
    except Exception as e:
        raw.unlink(missing_ok=True)
        print("  dl err", e)
        credits.append({"slug": slug, "status": "error", "error": str(e)})

(OUT / "CREDITS.md").write_text(
    "# Meal photo credits (Wikimedia Commons)\n\n"
    + "\n".join(
        f"- `{c.get('file', c['slug'])}` — {c.get('author','?')} ({c.get('license','?')}) {c.get('source','')}"
        for c in credits if c.get("file")
    )
    + "\n"
)
(OUT / "manifest.json").write_text(json.dumps(credits, indent=2))
print("done", sum(1 for c in credits if c.get("file")), "/", len(MEALS))
