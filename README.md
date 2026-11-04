# TameTV site

The official website for TameTV: the product home page and its public support and legal pages. It is a static Jekyll site with no theme, no JavaScript framework and no third-party requests. GitHub Pages builds it from the `main` branch.

| Page | URL | Purpose |
|---|---|---|
| Home | https://loungemote.github.io/TameTV/ | Marketing URL |
| Support | https://loungemote.github.io/TameTV/support/ | Support page |
| Privacy | https://loungemote.github.io/TameTV/privacy/ | Privacy Policy |
| Terms | https://loungemote.github.io/TameTV/terms/ | Terms of Use / EULA |

Existing app releases and store listings may still link to the previous `loungemote-site` pages. Keep those pages available until those links have been updated and verified.

Both apps open the same privacy, terms and support URLs. Keep the iOS `Links.swift` and Android link constants in step with this site.

## Layout

```
_config.yml            site settings: email, effective date, Google Play and App Store links, url and baseurl
index.html             home page (English, the default language); its text is in _data/home/en.yml
zh/ ja/ de/            translated home pages; their text is in _data/home/<i18n>.yml
_remotes/              one page per TV platform, for example /samsung-tv-remote/ (`remote` layout)
llms.txt               plain summary for AI assistants and search tools
privacy.md terms.md support.md   text pages (Markdown, `page` layout)
404.html robots.txt site.webmanifest favicon.ico favicon.svg
_layouts/              default.html (shell), page.html (text pages with a table of contents),
                       remote.html (platform pages), home-i18n.html (the home page in every language)
_includes/             head, header, footer, phone frame, store links, icons, trademark line
_data/home/*.yml       home page text per language, FAQ included (it also feeds the FAQPage structured data).
                       Every language has the same sections: hero, features, how it works, devices, privacy, FAQ
_data/platforms.yml    supported platforms (home page, support page, platform pages, llms.txt)
_data/languages.yml    translated home pages (hreflang links and the footer language menu)
_data/store_qr.json     generated Google Play and App Store QR targets and artwork paths
_data/app.yml          app features for the structured data
assets/css/main.css    all styles; tokens follow the app's design tokens (dark theme)
assets/js/main.js      menu, scroll reveal, card spotlight; the site works without it
assets/img/            app screens (WebP), icons, social image
tools/                 render_assets.py and check_site.py (not published)
```

## Before and after launch

Everything is in `_config.yml`.

- `email`: the support address. It must be a mailbox that someone reads, and it must match `supportEmail` in the app.
- `effective_date`: shown on the Privacy Policy and the Terms of Use. Change it when either page changes.
- `google_play_url`: the live Android listing (`com.pesafy.loungemote`). It controls Google Play download links independently.
- `app_store_url`: the live iPhone and iPad listing, `https://apps.apple.com/app/id6817682889`. It has no storefront: on iPhone and iPad it opens the App Store app in the visitor's own store. (A desktop browser in mainland China lands on the App Store home page instead, because Apple sends every link without `/cn/` there.) It controls App Store download links independently. Emptying it brings back a text line saying the iPhone and iPad version is coming soon.
- `app_store_id`: the numeric Apple ID, `6817682889`. It adds Safari's Smart App Banner.

The download badges are the stores' official artwork in each home page language (`assets/img/badges/`): Google Play's from https://play.google.com/intl/en_us/badges/, trimmed of transparent padding, and Apple's unmodified SVGs from https://toolbox.marketingtools.apple.com/app-store/ (Black, en-us, zh-cn, ja-jp, de-de), both 56 px high. A new home page language needs both badges.

## Keep the privacy policy true

Update `privacy.md`, Google Play Data safety and App Store App Privacy when you:

- add an SDK (analytics, crash reporting, RevenueCat, ads),
- add a server or an account feature,
- store new kinds of data.

Android is on Google Play and iPhone and iPad are on the App Store. The current Android release has no Firebase configuration and **Share Usage Data** is off by default. iOS uses Google Analytics for Firebase and Firebase Crashlytics, on by default and turned off with **Settings > Privacy > Share Usage Data**. Google Cast diagnostics are separate from this switch. The Privacy Policy, the home page privacy section and FAQ in `_data/home/*.yml`, `support.md` and `llms.txt` describe this. Keep them in step with the app's tracking plan (`docs/analytics/tracking-plan.md` in the app repo).

The Privacy Policy also says that this website has no cookies or analytics and loads nothing from other sites. Keep that true, or change the text.

When the app adds a platform, update `_data/platforms.yml`, `_includes/trademarks.html`, `_data/app.yml`, `llms.txt` and each `_data/home/*.yml`, and add a page in `_remotes/`.

## Search and AI answers

- Platform pages set `hero_screen` (default `remote` in `_config.yml`; LG uses `touchpad`): the page head then shows that app screen, the download badge and the trust line from `_data/home/en.yml`.
- Titles: the home page title is `seo_title` in `index.html` (translated pages: `title` in `_data/home/<i18n>.yml`); platform pages set `seo_title` in their front matter. Keep the words close to the App Store name and subtitle (`docs/app-store/metadata.json` in the app repo).
- Platform pages describe the shared Android and iOS capabilities; mark Siri and Shortcuts as iOS only. Use the apps’ **Supported TVs** screens as the source: pairing, typing, apps, inputs and casting per platform. Their `faq` front matter is also the page's FAQPage structured data.
- Translated home pages: add a language in `_data/languages.yml`, `_data/home/<i18n>.yml` and `<i18n>/index.html`. Use the app's own words for setting names (from `Localizable.xcstrings`). Legal and support pages stay in English. Change `en.yml` first and keep every language to the same sections and items.
- The published Android app has its own `MobileApplication` structured data with Android requirements and Google Play URLs. Do not attach the Play URL to an iOS app entity. The iOS app has its own entity with iOS requirements and the App Store URL, included while `app_store_url` is set. Download links, app metadata and `llms.txt` read availability from those settings.
- Keep all four home languages in step. Privacy summaries must distinguish Android from iOS; do not promise that the app collects no data.
- The site retains its original iOS design mockup screenshots and sharing artwork. Do not attach these iOS screenshots to Android app metadata.
- Add the site to Google Search Console and submit `sitemap.xml`.

## Local preview

```bash
bundle install
bundle exec jekyll serve
```

Then open http://localhost:4000/TameTV/.

## Checks

```bash
bundle exec jekyll build
python3 tools/check_site.py
python3 tools/test_store_availability.py
python3 tools/test_site_branding.py
```

`check_site.py` checks every internal link, anchor, image and script in `_site/`, the meta tags of each page, and the structured data. `test_store_availability.py` builds each combination of store availability in temporary directories. It checks download links on all product pages, accessible iOS placeholders, separate app metadata, the Smart App Banner and QR visibility when the store URL changes. `test_site_branding.py` checks the published brand and canonical URLs on every built page and in the web manifest.

## Images

The app screens, icons and social image retain the original iOS design mockups, with the same brand-neutral text as the App Store screenshots:

```bash
python3 tools/render_assets.py /path/to/app-repo
```

It needs Google Chrome, `beautifulsoup4` and `Pillow`. The device frame around each screen is CSS (`.phone` in `main.css`).

The website Apps preview uses category glyphs for the fictional demo apps, such as a film strip for Cinemo and a music note for Soundwave. `tools/render_assets.py` replaces the board's initials during rendering. To update only this image, run `python3 tools/render_assets.py /path/to/app-repo apps`.

## Download QR code

The desktop home-page download section displays a QR code for each live listing: Google Play on the left of the badges and the App Store on the right. Screens below 900 px keep the direct store buttons. The QR image is a local SVG with a white background and a four-module quiet zone. It adds no external requests or client-side library.

To regenerate after changing `google_play_url` or `app_store_url`:

```bash
python3 -m pip install qrcode==8.2
python3 tools/generate_store_qr.py
bundle exec jekyll build
python3 tools/test_store_availability.py
```

The generator updates the images and `_data/store_qr.json` together, and skips a store whose URL is empty. If a configured URL differs from its generated target, the template hides that QR code until it is regenerated.

## Custom domain later

Add the domain in **Settings > Pages > Custom domain**, set `url` to it and `baseurl` to `""` in `_config.yml`. Every link in the site goes through `relative_url`, so nothing else changes. GitHub Pages then redirects the `github.io` URLs to the new domain. Update the URLs in App Store Connect and in the app's `Links.swift`.
