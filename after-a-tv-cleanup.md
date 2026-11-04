---
layout: page
title: Cleaned up your TV? Make sure nothing broke.
description: Used CleanYourTV or another ADB tool on Google TV or Fire TV? Check from your phone that casting and the remote still work and network debugging is off.
lead: Used CleanYourTV or another ADB tool to stop the ads? Sometimes casting or the remote goes with them, or network debugging stays on. Check it from your phone in a few seconds.
hero_screen: after-cleanup
hero_alt: "After a TV Cleanup: casting is switched off and network debugging is on, each with its fix. Remote control and AirPlay work."
trust: ["The check is free", "No account", "Changes nothing on the TV"]
faq:
- q: Will it undo my cleanup?
  a: No. The check only looks, and changes nothing on the TV. For each thing that needs fixing, it shows where the setting is, and you decide. Everything else you turned off stays off.
- q: Which TVs does it check?
  a: TVs and streaming devices with Google TV or Android TV, whatever the brand, and Amazon Fire TV, the TVs that these cleanup tools work on. Casting and AirPlay are checked on Google TV and Android TV. The remote itself also works with Samsung, LG, Roku, Vizio, Hisense, Apple TV and more.
- q: Why turn network debugging off?
  a: Cleanup tools need it to reach the TV, and it often stays on afterwards. While it is on, a device on your Wi-Fi that the TV once allowed, such as the computer that ran the cleanup, can still connect and control the TV. Turning it off when you are done closes that door. You can turn it on again for your next cleanup.
- q: Does it cost anything?
  a: No. The check and its fixes are free, and so are the basic remote keys. Pro adds typing with your phone keyboard, apps in one tap, the touchpad and more.
---
{%- comment -%}
  The check after a TV cleanup (#47 in the app's 1.5.0 plan, DD-74 in the app repo): what the app checks and how to
  reach it. Keep it in step with the app's AfterCleanup code and its strings. The hero screen is drawn from the 1.5.0
  design board "AfterClean", changed to what the app shows (tools/render_assets.py). The FAQ is in the front matter, which also gives the page its
  FAQPage structured data (head.html).
{%- endcomment %}

## What it checks

Cleanup tools turn off apps and services over network debugging. Now and then they turn off something you still use, and they need network debugging on to work at all. {{ site.title }} checks the things a cleanup most often breaks or leaves on.

### Network debugging

If it is still on, the app tells you, and shows where to turn it off in the TV's settings.

### Casting and AirPlay

On Google TV and Android TV, the app finds out whether phones can still cast to the TV. If Chromecast built-in was turned off, it shows which setting turns it back on. On TVs with AirPlay built in, it checks that AirPlay answers too.

### The remote service

If your phone can no longer control the TV, the app finds out whether the TV's remote service was switched off, and shows where to turn it back on.

## How it works

1. **Open {{ site.title }} on the same Wi-Fi as the TV.** The app finds the TV by itself. The first time, you type the code the TV shows.
2. **Open Tune-up and tap After a TV cleanup.** On Philips and Xiaomi TVs it is in **Settings > Help & Troubleshooting**. The check takes a few seconds and lists what needs you first.
3. **Fix what is off.** Each fix shows the setting's path on the TV. When you are back, the app checks again, so you see that it worked.

## What the check never does

The check runs on your phone, over your Wi-Fi. It only looks: it opens a connection to the TV and closes it without a word, and it listens for the services the TV announces on your network. It sends the TV no commands and changes no settings. If **Share Usage Data** is on, the app reports which checks needed fixing, never the TV's name or address. See the [privacy policy]({{ '/privacy/' | relative_url }}).

## Questions

{% for item in page.faq %}
### {{ item.q }}

{{ item.a }}
{% endfor %}

## Get {{ site.title }}

Android needs Android 8.0 or later. iPhone and iPad need iOS 17 or iPadOS 17 or later.

{% include store-badge.html %}

Setup guides for each TV are on the [home page]({{ '/' | relative_url }}#tvs), and more help is on the [support page]({{ '/support/' | relative_url }}).

<hr>
<p><small>{{ site.title }} is not affiliated with CleanYourTV, a separate tool. The TV makers’ trademarks are listed at the foot of the page.</small></p>
