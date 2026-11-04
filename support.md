---
layout: page
title: Support
permalink: /support/
eyebrow: Help
lead: Answers to the most common questions about TameTV, and how to reach us when you need a person.
description: Get help with TameTV. Supported TVs, fixes for discovery, pairing and power-on problems, purchases and how to contact support.
---

<div class="contact-card">
  <div>
    <h2 id="contact">Contact us</h2>
    <p>Tell us your TV brand and model, and your iOS or Android version. We answer by email.</p>
  </div>
  <a class="button button--ghost" href="mailto:{{ site.email }}">{% include icon.html name="mail" %}{{ site.email }}</a>
</div>

In the app, **Contact Support** writes this email for you and can attach a diagnostics file with private details removed.

## Supported devices

<ul class="device-table">
  {%- for p in site.data.platforms %}
  <li><strong>{{ p.name }}</strong><span>{{ p.detail }}</span></li>
  {%- endfor %}
</ul>

Philips TVs with Google TV connect as Google TV. Casting is available on compatible TVs, Chromecast and DLNA devices; formats and playback features depend on the receiver. Casting to Fire TV is not supported. Apple TV takes photos and videos over AirPlay instead of casting from TameTV.

Your phone or tablet and your TV must be on the same Wi-Fi network. Android requires Android 8.0 or later. iPhone and iPad require iOS 17 or iPadOS 17 or later.
{% include store-badge.html %}

## The app cannot find my TV

1. Make sure that the TV is on.
2. Connect your phone or tablet and your TV to the same Wi-Fi network. Guest networks often block the connection between devices.
3. **Android:** allow **Nearby devices** when requested. **iOS:** open **Settings > Privacy & Security > Local Network** and turn on **TameTV**.
4. On a Roku device, open **Settings > System > Advanced system settings > Control by mobile apps** and set **Network access** to **Default** or **Permissive**.
5. Close and open the app again. If the problem continues, restart the TV and your Wi-Fi router.

If the TV still does not appear, choose **Add by IP address** in the app and type the address from the TV's network settings.

## The TV asks me to allow the connection

The first time you connect, Samsung and LG TVs show a prompt on the screen. Select **Allow**. If you do not have the TV remote, use the buttons on the TV.

Android TV, Google TV, Fire TV, Vizio, Sony, Hisense and Philips Titan OS TVs and Apple TV show a code on the screen. Type this code in the app.

## The app cannot turn on my TV

Turn on the TV setting that lets the TV start from the network:

- **Samsung:** Power On with Mobile
- **LG:** Turn on via Wi-Fi, or Mobile TV On
- **Roku TV:** Fast TV start

The setting names and menu locations can be different on your TV model.

## Casting stops when I close the app

Local photos and videos play from a temporary server on your phone or tablet. Keep TameTV in the foreground during playback. A receiver can load supported internet links directly, so playback may continue after you close the app.

## Screen mirroring

Media casting sends selected media to the TV. Screen mirroring uses Android’s system screen-casting settings or AirPlay on iOS. Compatibility depends on your phone and TV. TameTV provides a guide, not its own screen-mirroring service.

## Restore purchases

In the app, open **Settings** and tap **Restore Purchases**. **Android:** use the Google account used for the purchase. **iOS:** use the Apple Account used for the purchase. Google Play and App Store purchases do not transfer between platforms.

## Cancel a subscription

**Android:** open **Google Play > Profile > Payments & subscriptions > Subscriptions**, select **TameTV**, then cancel. See [Google Play’s instructions](https://support.google.com/googleplay/answer/7018481?hl=en).

**iOS:** open **Settings > [your name] > Subscriptions**, then select **TameTV**. See [Apple’s instructions](https://support.apple.com/en-us/118428).

Deleting the app does not cancel a subscription. Cancel before the trial or subscription renews.

## Refunds

Use the store that processed your payment: [Google Play refund help](https://support.google.com/googleplay/answer/2479637?hl=en) for Android or [reportaproblem.apple.com](https://reportaproblem.apple.com) for iOS.

## Privacy and terms

TameTV has no accounts and no ads, and remote commands stay on your local network. The iOS version has optional usage and crash reports controlled by **Share Usage Data**. The Android release has no Firebase configuration. Google Cast processing is separate from that switch. Read the [Privacy Policy]({{ '/privacy/' | relative_url }}) and the [Terms of Use]({{ '/terms/' | relative_url }}).

---

<small>{% include trademarks.html %}</small>
