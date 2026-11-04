#!/usr/bin/env python3
"""Checks the built site in _site/: every internal link, anchor, image and script resolves,
each page has its required meta tags, and the structured data is valid JSON.

    bundle exec jekyll build && python3 tools/check_site.py
"""
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse

SITE = Path(__file__).resolve().parents[1] / "_site"
BASEURL = ""
for line in (SITE.parent / "_config.yml").read_text(encoding="utf-8").splitlines():
    if line.startswith("baseurl:"):
        BASEURL = line.split(":", 1)[1].split("#")[0].strip().strip('"')


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs, self.ids, self.meta, self.jsonld, self.imgs = [], set(), {}, [], []
        self.title = ""
        self._in = None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            self.ids.add(a["id"])
        for key in ("href", "src"):
            if a.get(key):
                self.refs.append((tag, a[key]))
        if tag == "meta":
            self.meta[a.get("name") or a.get("property")] = a.get("content", "")
        if tag == "link" and a.get("rel") == "canonical":
            self.meta["canonical"] = a.get("href", "")
        if tag == "img":
            self.imgs.append(a)
        if tag == "title":
            self._in = "title"
        if tag == "script" and a.get("type") == "application/ld+json":
            self._in = "jsonld"
            self.jsonld.append("")

    def handle_endtag(self, tag):
        if tag in ("title", "script"):
            self._in = None

    def handle_data(self, data):
        if self._in == "title":
            self.title += data
        elif self._in == "jsonld":
            self.jsonld[-1] += data


def resolve(path):
    """The file in _site that serves a site-absolute URL path, or None."""
    if not path.startswith(BASEURL + "/") and path != BASEURL:
        return None
    rel = unquote(path[len(BASEURL):]).lstrip("/")
    target = SITE / rel
    if target.is_dir():
        target = target / "index.html"
    return target if target.is_file() else None


def main():
    pages = {p: Page() for p in sorted(SITE.rglob("*.html"))}
    for path, page in pages.items():
        page.feed(path.read_text(encoding="utf-8"))

    errors, checked = [], 0
    for path, page in pages.items():
        name = str(path.relative_to(SITE))
        url_dir = BASEURL + "/" + str(path.parent.relative_to(SITE)).replace(".", "", 1)
        url_dir = url_dir.rstrip("/") + "/"
        for tag, ref in page.refs:
            parsed = urlparse(ref)
            if parsed.scheme in ("http", "https", "mailto"):
                own = re.match(r"https://[a-z0-9.-]+" + re.escape(BASEURL) + r"(/.*)?$", ref)
                if not (own and tag in ("a", "link")):
                    continue
                parsed = urlparse(BASEURL + (own.group(1) or "/"))
            checked += 1
            target_path = parsed.path or str(url_dir)
            if not target_path.startswith("/"):
                target_path = url_dir + target_path
            target = path if not parsed.path else resolve(target_path)
            if target is None:
                errors.append(f"{name}: broken link {ref}")
            elif parsed.fragment and target.suffix == ".html" and unquote(parsed.fragment) not in pages[target].ids:
                errors.append(f"{name}: missing anchor {ref}")

        if name != "404.html":
            for key in ("description", "canonical", "og:title", "og:description", "og:image", "og:url", "twitter:card"):
                if not page.meta.get(key):
                    errors.append(f"{name}: missing {key}")
        if not page.title.strip():
            errors.append(f"{name}: missing <title>")
        if len(page.meta.get("description", "")) > 170:
            errors.append(f"{name}: description longer than 170 characters")
        for img in page.imgs:
            if "alt" not in img or not img.get("width") or not img.get("height"):
                errors.append(f"{name}: <img {img.get('src')}> needs alt, width and height")
        for block in page.jsonld:
            try:
                json.loads(block)
            except ValueError as error:
                errors.append(f"{name}: invalid JSON-LD ({error})")

    for extra in ("robots.txt", "sitemap.xml", "site.webmanifest", "favicon.ico", "favicon.svg", "assets/img/og.jpg"):
        if not (SITE / extra).is_file():
            errors.append(f"missing {extra}")
    json.loads((SITE / "site.webmanifest").read_text(encoding="utf-8"))

    print(f"{len(pages)} pages, {checked} internal references checked")
    for error in errors:
        print("ERROR", error)
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
