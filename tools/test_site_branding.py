#!/usr/bin/env python3
"""Check the published brand and canonical URLs in the built site."""

import json
import re
import unittest
from pathlib import Path

from check_site import Page


ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "_site"
PUBLIC_URL = "https://loungemote.github.io/TameTV/"
ALLOWED_OLD_IDENTIFIERS = (
    "com.pesafy.loungemote",
    "loungemote@outlook.com",
    "loungemote.github.io",
)


class SiteBrandingTests(unittest.TestCase):
    def test_all_pages_use_the_new_brand_and_public_url(self):
        pages = sorted(SITE.rglob("*.html"))
        self.assertTrue(pages, "Build the site before running this test")
        for path in pages:
            with self.subTest(page=path.relative_to(SITE)):
                html = path.read_text(encoding="utf-8")
                page = Page()
                page.feed(html)
                relative = path.relative_to(SITE).as_posix()
                if relative == "index.html":
                    relative = ""
                elif relative.endswith("/index.html"):
                    relative = relative[:-len("index.html")]

                self.assertIn("TameTV", page.title)
                self.assertEqual(page.meta.get("canonical"), PUBLIC_URL + relative)
                self.assertNotIn("/loungemote-site", html.lower())
                for identifier in ALLOWED_OLD_IDENTIFIERS:
                    html = re.sub(re.escape(identifier), "", html, flags=re.IGNORECASE)
                self.assertNotRegex(html, re.compile(r"\bloungemote\b", re.IGNORECASE))

    def test_web_manifest_uses_the_new_brand_and_path(self):
        manifest = json.loads((SITE / "site.webmanifest").read_text(encoding="utf-8"))
        self.assertEqual(manifest["name"], "TameTV")
        self.assertEqual(manifest["short_name"], "TameTV")
        self.assertEqual(manifest["start_url"], "/TameTV/")


if __name__ == "__main__":
    unittest.main()
