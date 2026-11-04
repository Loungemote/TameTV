#!/usr/bin/env python3
"""Renders the site's images from the app repo.

Screens: the TameTV 1.5.0 design boards, drawn by the app repo's store screenshot pipeline
(docs/app-store/screenshots/screens.py) at the boards' own size, 390 x 844 pt @2x, with the status bar but no device
frame: the site draws the frame in CSS (`.phone`). TVs are named by their kind (OLED TV, 4K TV, HD TV), never by a
room, as everywhere on the site. The pipeline builds English only until the app has the 1.5.0 strings, so every home
page language shows these English screens. The pipeline has no after-cleanup screen, so this file draws it from the
board "AfterClean", changed to what the app shows. The site shows no PRO marks, so the screens drop the ones the
store screenshots draw for a free user.
Social image: the home page's English hero line next to the remote screen, 1200 x 630.

    python3 tools/render_assets.py [path/to/app-repo [screens] [icons] [og]]

Needs what the pipeline needs (Node with Playwright and its Chromium), PyYAML and Pillow. The app repo defaults to
../TameTV.
"""
import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import yaml
from PIL import Image

SITE = Path(__file__).resolve().parents[1]
APP = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else SITE.parent / "TameTV"
PIPELINE = APP / "docs" / "app-store" / "screenshots"
IMG = SITE / "assets" / "img"
ICON_PNG = APP / "ios" / "Loungemote" / "Resources" / "Assets.xcassets" / "AppIcon.appiconset" / "AppIcon.png"

# The screens the site shows: the story chapters on the home page, Tune-up, and the head of the platform pages
# (`hero_screen`: remote, or touchpad for LG) and of the after-cleanup page.
SCREENS = ("remote", "touchpad", "talk", "keyboard", "lock-screen", "quiet-ads", "tune-up", "after-cleanup")

# The store's made-up TV names (l10n.NAMES) and the site's. The store names a TV by its room and shows its kind
# beneath; the site names it by its kind and shows its resolution, like the TV in the hero.
TV_NAMES = {
    "Living Room TV": "OLED TV",
    "OLED TV": "4K",
    "Bedroom TV": "4K TV",
    "Office TV": "HD TV",
    "4K TV": "4K",
    "HD TV": "HD",
}

# Screenshots with Playwright, as the pipeline's render.js does. File access lets the page load the site's fonts.
SHOT_JS = """
const { chromium } = require('playwright');
(async () => {
  const [src, out, w, h] = process.argv.slice(2);
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: +w, height: +h } });
  await page.goto(src, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out });
  await browser.close();
})();
"""


def node_env():
    env = dict(os.environ)
    if "NODE_PATH" not in env:
        env["NODE_PATH"] = subprocess.run(["npm", "root", "-g"], capture_output=True, text=True).stdout.strip()
    return env


def after_cleanup(p):
    """The check after a TV cleanup (AfterCleanupView.swift in the app repo), from the board "AfterClean": the large
    title, the summary and the TV's line, the problems in the check's order, the rows' look, no wake row (not built),
    the lock line and Check Again. `p` is the pipeline (screens.py)."""
    red_row = '<div style="border-radius: 20px; padding: 14px; background: rgba(255,107,99,0.07);'
    tick_svg = ('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3DD68C" stroke-width="2.6" '
                'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>')

    def build(platform):
        style, h = p.board("AfterClean")
        # iOS: the navigation bar's back button and a large title. The TV pill isn't built; the TV's line is under the
        # summary.
        h = p.cut(h, '<span style="height: 32px; padding: 0 12px; border-radius: 16px;', "</div>\n<h1")
        h = p.text_of(h, "After a TV cleanup", "After a TV Cleanup")
        h = p.swap(h, '<p style="margin: 6px 0 0; font-size: 15px; line-height: 20px; color: #A3A9B6">2 things need fixing. '
                      'The rest still works.</p>',
                   '<div style="margin: 14px 0 0; font-size: 20px; line-height: 25px; font-weight: 700">2 things to fix</div>'
                   '<div style="margin: 3px 0 0; font-size: 15px; line-height: 20px; color: #A3A9B6">⟪Living Room TV⟫ · Google TV</div>')
        # The problems in the check's order: casting comes before network debugging.
        first = h.index(red_row)
        second = h.index(red_row, first + 1)
        end = h.index('<div style="border-radius: 20px; background: rgba(255,255,255,0.055);', second)
        h = h[:first] + h[second:end] + h[first:second] + h[end:]
        # The fix is a red capsule, and the icon sits in a circle (problemRow).
        h = p.swap(h, "border-radius: 12px; background: rgba(255,255,255,0.10); font-size: 14px; font-weight: 600;",
                   "border-radius: 18px; background: rgba(255,107,99,0.14); color: #FF8C85; font-size: 15px; font-weight: 600;", 2)
        h = h.replace("width: 36px; height: 36px; flex: none; border-radius: 11px;",
                      "width: 36px; height: 36px; flex: none; border-radius: 18px;")
        # What still works: a check in a green circle (restRow), and no wake row.
        h = p.cut(h, '<div style="height: 1px; margin-left: 44px; background: rgba(255,255,255,0.08)"></div>\n<div style="min-height: 52px; '
                     f'padding: 0 14px; display: flex; align-items: center; gap: 12px">{tick_svg}<span style="flex: 1; font-size: 15px">Wakes up from your phone',
                  "\n</div>\n</div>")
        tick = ('<span aria-hidden="true" style="width: 26px; height: 26px; flex: none; border-radius: 13px; background: rgba(61,214,140,0.15); '
                'display: flex; align-items: center; justify-content: center"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" '
                'stroke="#3DD68C" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>')
        h = h.replace(f'{tick_svg}<span style="flex: 1; font-size: 15px">', tick + '<span style="flex: 1; font-size: 17px">')
        h = h.replace("margin-left: 44px; background: rgba(255,255,255,0.08)", "margin-left: 52px; background: rgba(255,255,255,0.08)")
        # The promise under the list, and the button's icon.
        lock = p.svg('<rect x="5" y="11" width="14" height="9.5" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>', 13, 2)
        h = p.swap(h, '\n<div style="flex: 1"></div>',
                   '\n<div style="margin-top: 16px; display: flex; justify-content: center; align-items: center; gap: 5px; font-size: 13px; '
                   f'line-height: 18px; color: #8B91A0">{lock}TameTV only looks. It changes nothing on the TV.</div>\n<div style="flex: 1"></div>')
        refresh = p.svg('<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4.5V11h-6.5"/>', 19, 2.2)
        h = p.swap(h, ">Check Again</button>", f">{refresh}Check Again</button>")
        h = p.swap(h, "color: #2A1404; font-size: 17px; font-weight: 600;",
                   "color: #2A1404; font-size: 17px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px;")
        assert "Wakes up" not in h and "Sony" not in h
        return style, h

    return build


# The PRO marks the store screenshots put on what needs Pro (screens.PRO_PILL, the dock's marks).
PRO_MARK = re.compile(r'<span aria-hidden="true" style="position: absolute;[^"]*">PRO</span>')


def without_pro(build):
    """A screen builder that draws the screen without PRO marks: the site shows none."""
    def web(platform):
        style, h = build(platform)
        h = PRO_MARK.sub("", h)
        assert ">PRO<" not in h
        return style, h

    return web


def screens():
    sys.path.insert(0, str(PIPELINE))
    import l10n  # noqa: E402  (the pipeline's text and made-up names)
    import screens as pipeline  # noqa: E402

    store_names = l10n.names

    def site_names(locale):
        names = dict(store_names(locale))
        names.update(TV_NAMES)
        return names

    l10n.names = site_names
    pipeline.SCREENS.setdefault("after-cleanup", after_cleanup(pipeline))
    for name in SCREENS:
        pipeline.SCREENS[name] = without_pro(pipeline.SCREENS[name])
    pipeline.DEVICES["web"] = (390, 844, 2, "ios")
    with tempfile.TemporaryDirectory() as tmp:
        pipeline.CAPTURES = Path(tmp) / "captures"
        pipeline.WORK = Path(tmp) / "work"
        pipeline.render([pipeline.build("en-US", "web", name) for name in SCREENS])
        for name in SCREENS:
            img = Image.open(pipeline.CAPTURES / "en-US" / "web" / f"{name}.png").convert("RGB")
            assert img.size == (780, 1688), img.size
            img.save(IMG / "screens" / f"{name}.webp", "WEBP", quality=84, method=6)
            print(f"assets/img/screens/{name}.webp")


def icons():
    icon = Image.open(ICON_PNG).convert("RGB")
    for size, name in ((180, "apple-touch-icon.png"), (192, "icon-192.png"), (512, "icon-512.png")):
        icon.resize((size, size), Image.LANCZOS).save(IMG / name, optimize=True)
    icon.resize((256, 256), Image.LANCZOS).save(IMG / "app-icon.webp", "WEBP", quality=92, method=6)
    icon.save(SITE / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    print("icons")


def og():
    """The social sharing image, 1200 x 630, in the site's own type and phone frame."""
    hero = yaml.safe_load((SITE / "_data" / "home" / "en.yml").read_text(encoding="utf-8"))["hero"]
    css = (SITE / "assets" / "css" / "main.css").as_uri()
    page = f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><link rel="stylesheet" href="{css}">
<style>
html, body {{ width: 1200px; height: 630px; overflow: hidden; }}
.og-glow {{ position: absolute; inset: 0; background:
  radial-gradient(520px 440px at 940px 400px, rgba(255, 138, 52, 0.24), transparent 70%),
  radial-gradient(760px 460px at 0 0, rgba(255, 154, 61, 0.11), transparent 70%); }}
.og-copy {{ position: absolute; left: 84px; top: 0; bottom: 0; width: 610px; display: flex; flex-direction: column;
  justify-content: center; }}
.og-brand {{ display: flex; align-items: center; gap: 14px; font-size: 30px; font-weight: 700; letter-spacing: -0.02em; }}
.og-brand img {{ width: 52px; height: 52px; border-radius: 12px; }}
.og-copy h1 {{ margin-top: 34px; font-size: 82px; }}
.og-copy p {{ margin-top: 26px; color: var(--text-2); font-size: 28px; line-height: 1.32; }}
.og-phone {{ position: absolute; left: 752px; top: 56px; }}
</style></head><body>
<div class="og-glow"></div>
<div class="og-copy">
  <span class="og-brand"><img src="{(IMG / 'app-icon.webp').as_uri()}" alt="">TameTV</span>
  <h1 class="hero__title">{hero['title']}</h1>
  <p>{hero['lead']}</p>
</div>
<div class="og-phone"><div class="phone" style="--pw: 372px"><div class="phone__screen">
  <img src="{(IMG / 'screens' / 'remote.webp').as_uri()}" alt=""><span class="phone__island"></span>
</div></div></div>
</body></html>"""
    with tempfile.TemporaryDirectory() as tmp:
        src, shot, png = Path(tmp) / "og.html", Path(tmp) / "shot.js", Path(tmp) / "og.png"
        src.write_text(page, encoding="utf-8")
        shot.write_text(SHOT_JS, encoding="utf-8")
        subprocess.run(["node", str(shot), src.as_uri(), str(png), "1200", "630"], check=True, env=node_env())
        img = Image.open(png).convert("RGB")
        assert img.size == (1200, 630), img.size
        img.save(IMG / "og.jpg", "JPEG", quality=90, optimize=True, progressive=True)
    print("assets/img/og.jpg", (IMG / "og.jpg").stat().st_size // 1024, "KB")


if __name__ == "__main__":
    (IMG / "screens").mkdir(parents=True, exist_ok=True)
    only = sys.argv[2:] or ["screens", "icons", "og"]
    if "screens" in only:
        screens()
    if "icons" in only:
        icons()
    if "og" in only:
        og()
