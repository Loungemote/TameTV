---
layout: page
title: Privacy Policy
permalink: /privacy/
dated: true
lead: TameTV is a TV remote for iPhone, iPad and Android. This policy explains the data used by each version.
description: Privacy information for TameTV on iOS and Android, including local TV data, the camera and microphone, casting, FaceTime help, purchases and optional analytics.
---
{%- comment -%}
  This policy is true for the apps in the stores now and for 1.5.0: what 1.5.0 adds says "from version 1.5.0". Publish it
  just before 1.5.0 goes to review, and set `effective_date` in _config.yml to that day.
  Voice search and Quiet Ads are not in the app code yet (release/1.5.0 at 93c9061), so their lines follow the 1.5.0 design
  and store copy. Check them against the built features before publishing, and take out what doesn't ship. Keep this page
  in step with the app's tracking plan (docs/analytics/tracking-plan.md) and its permission strings.
{%- endcomment %}

## Summary

<div class="summary" markdown="1">

- TameTV has no app accounts or advertising.
- Remote commands go directly from your phone to the selected TV on your local network. We do not relay them through our servers. When family helps you over FaceTime (iPhone and iPad, from version 1.5.0), their key presses reach your phone through Apple's SharePlay.
- From version 1.5.0, TameTV can use the camera to read your TV's screen and the microphone to hear you. TameTV does not save the images or the sound, and does not send them to us. Voice search and voice typing use your phone's own speech recognition.
- The iOS version has optional Firebase usage and crash reporting, on by default. On Android, Firebase reporting comes with version 1.5.0 and starts only if you turn on Share Usage Data, which is off by default.
- Google Cast, and on Android Google's text recognition, have their own diagnostic collection. Share Usage Data does not control that SDK data.
- Apple processes iOS purchases. Google Play processes Android purchases.

</div>

This policy covers TameTV on iOS and Android. The Android package is `com.pesafy.loungemote`, distributed through the Google Play developer account Saleslify Technologies. In this policy, "we" means the developer of TameTV.

## Camera and microphone {#camera-and-microphone}

From version 1.5.0, TameTV can use your phone's camera and microphone, on Android, iPhone and iPad. It asks for each permission the first time a feature needs it. If you say no, the rest of the app keeps working.

### Camera

The camera reads your TV's screen:

- to read the pairing code that the TV shows, so you don't have to type it,
- in Camera Assist, to find its way through the TV's settings menus and show you the next key, or press it for you.

The text is recognized on your phone: by Apple's Vision framework on iPhone and iPad, and by Google's ML Kit text recognition, part of Google Play services, on Android. TameTV does not save the camera's picture or the text it reads, and does not send them to us or to anyone else. ML Kit does not send images or recognized text to Google, but it sends Google its own performance and usage metrics, with your device model and Android version. Share Usage Data does not control it. See [Google's ML Kit terms](https://developers.google.com/ml-kit/terms).

### Microphone

- **Camera Assist.** While TameTV presses your TV's keys for you, it listens for you to say "Stop". The words are recognized on your phone. If your phone can't recognize speech on the device, TameTV doesn't listen.
- **Quiet Ads** (TameTV Pro). While Quiet Ads is on, TameTV listens to how loud the TV is, on your phone, and turns the TV down during loud ads. It measures loudness only and does not recognize words.
- **Voice search** (TameTV Pro). Your phone's speech recognition turns what you say into text, and TameTV types the text into the TV's search.
- **Voice typing.** On the keyboard screen, the microphone opens your phone's own voice typing: on Android, your phone's speech service, such as Google's; on iPhone and iPad, Apple's dictation. TameTV receives only the text and sends it to the TV like typed text.

TameTV does not save sound and does not send it to us. For voice search and voice typing, the speech recognition comes from Apple on iPhone and iPad and from your phone's speech service on Android. It may run on that company's servers, under its own privacy policy, for example [Apple's](https://www.apple.com/legal/privacy/) or [Google's](https://policies.google.com/privacy).

You can turn camera and microphone access off at any time in your phone's settings: on iPhone and iPad under TameTV in the Settings app, and on Android in the app's permissions.

## Android privacy

### Local data and TV control

The Android app stores saved TV names, local network addresses, settings and playlists on the device. Pairing records use AES-GCM with a non-exportable key in Android Keystore; for an Apple TV they include the keys that the app and the Apple TV exchange when you pair them. Android TV client keys also stay in Android Keystore. The app excludes these records from Android backups.

Remove a TV in the app to remove its saved pairing records. Clear recent links and playlists in the app to remove those entries. Android's app-data deletion controls remove the app's local records.

Remote keys and typed text go to the selected TV. For local media casting, the selected receiver reads the chosen media from a temporary HTTP server on your Android device. Keep the app open during local playback; the server stops when the app leaves the foreground. Some TV protocols and local media routes use unencrypted local transports. The app does not claim that all local traffic is encrypted.

From version 1.5.0, if you save Tune-up's share card, the app adds that one image to your pictures.

### Google Cast

Google Cast can send anonymous discovery, session, mobile-device and app information to Google for SDK analytics and performance improvement. Google states that these logs use encrypted transport and that apps and users cannot disable or delete this SDK data. The Share Usage Data switch does not control it. See [Google's Cast SDK disclosure](https://developers.google.com/cast/docs/android_sender/data_disclosure) and [Google's privacy policy](https://policies.google.com/privacy).

### Usage data and crash reports {#android-usage-data-and-crash-reports}

Android releases before 1.5.0 do not include a Firebase configuration, and they send no usage statistics or crash reports. From version 1.5.0, the Android app can use Google Analytics for Firebase and Firebase Crashlytics, services of Google, but only after you turn on **Settings > Privacy > Share Usage Data**. It is off by default, and the Firebase SDK does not start until you turn it on. One switch covers both usage statistics and crash reports.

When it is on, the Android app sends:

- events about how you use the app, for example which screen you open, whether a connection to a TV succeeds or fails, how many remote keys you press in a session (the total, not which keys), whether a cast starts, and how Tune-up, Camera Assist and the check after a TV cleanup end (for example which checks found something to fix),
- the TV platform, for example Google TV or Fire TV, and the TV brand that you choose in the app's setup guide,
- crash reports: the crash location in the code, the app and Android versions, your device model, and the app events just before the crash,
- data that the Firebase SDK adds by itself: identifiers created at random for this installation, your device model and Android version, and a coarse location (country or region) that Google derives from your IP address.

The Android app never sends: TV names or model numbers, IP or MAC addresses, Wi-Fi network names, serial numbers, text you type or say, messages you show on the TV, the names of apps you open on the TV, what the camera sees or the text it reads, the names or contents of photos, videos, files and links you cast, pairing codes or keys, your Google account, email address or purchase tokens.

The app does not use the advertising ID and turns off Google's advertising features, so this data is not used for ads. We do not link it to your identity. Google keeps event-level data for no more than 14 months and crash reports for 90 days. When you turn off **Share Usage Data**, the app stops sending usage statistics and crash reports. See [Google's privacy policy](https://policies.google.com/privacy) and [how Google uses data from apps that use its services](https://policies.google.com/technologies/partner-sites).

### Google Play purchases and support

Google Play processes Android payments. The app receives product, purchase-state, purchase-token and signature information to verify purchases and restore Pro access. It verifies the purchase signature and acknowledges completed purchases. We do not receive your payment-card details.

Cancel an Android subscription through Google Play before its next renewal. Deleting the app does not cancel a subscription. Restore with the Google account used for the purchase. Google Play handles payment and refund requests.

The support address is [{{ site.email }}](mailto:{{ site.email }}). You can review a support message before sending it. A message discloses your email address and the information you include. The app can prepare diagnostics with private TV identifiers removed. We use support correspondence only to respond and you can ask us to delete it.

## iPhone and iPad privacy

The iPhone and iPad app is available on the App Store. The following sections describe the iOS version. The camera and microphone, website, children and contact sections apply to both platforms.

## iOS: local network access {#local-network-access}

The app asks for Local Network permission. It uses this permission to:

- find TVs and streaming devices on your Wi-Fi network,
- send remote control commands to the TV that you select,
- turn on a TV with Wake-on-LAN, if you use this feature,
- send photos, videos and links that you choose to a TV or cast device.

Remote control commands stay on your local network, between your iPhone and your TV. The exception is help over FaceTime, described below.

## iOS: casting {#casting}

When you cast a photo or video from your iPhone, the app serves that one file to the TV over your Wi-Fi network while it plays. The app serves the selected media to the receiver without uploading it to our servers. When you cast a link, or from version 1.5.0 open a video link in the TV's own app, the TV loads the link from the internet by itself.

Links you played recently and playlists you add are stored only on your iPhone. You can clear them in the app.

To cast to Chromecast and other Google Cast devices, the app uses Google's Cast SDK. The SDK starts only when you use casting. It sends Google diagnostic data, usage data about the cast session, a device identifier and a coarse location derived from your IP address. Google does not link this data to you, and it is not used for tracking. See [Google's privacy policy](https://policies.google.com/privacy).

## iOS: usage data and crash reports {#usage-data-and-crash-reports}

The app uses Google Analytics for Firebase and Firebase Crashlytics, services of Google, to learn which features are used, which TV platforms connect reliably, where people get stuck, and why the app crashes. This is on when you first install the app. You can turn it off at any time in the app in **Settings > Privacy > Share Usage Data**. One switch covers both usage statistics and crash reports.

When it is on, the app sends:

- events about how you use the app, for example which screen you open, whether a connection to a TV succeeds or fails and with which error, how many remote keys you press in a session (the total, not which keys), and whether a cast starts,
- from version 1.5.0, also how Tune-up, Camera Assist and the check after a TV cleanup end (for example which checks found something to fix), the TV brand that you choose in the app's setup guide, and when help over FaceTime starts and ends, with how long it lasted and how many keys were pressed,
- the TV platform, for example Roku or Samsung, and the model number that the TV reports, for example QN65Q80,
- app settings, for example the remote layout and the app language, and whether you use the free version or TameTV Pro, with which plan,
- purchases that you make in the app: the product, price and currency,
- crash reports: the crash location in the code, the app and iOS versions, your device model, and the app events just before the crash,
- data that the Firebase SDK adds by itself: an app instance identifier created at random for this installation, your device model and iOS version, and a coarse location (country or region) that Google derives from your IP address.

The app never sends: TV names, IP or MAC addresses, Wi-Fi network names, serial numbers, text you type or say for the TV, messages you show on the TV, the names of apps you open on the TV, what an Apple TV is playing, what the camera sees or the text it reads, the names or contents of photos, videos, files and links you cast, pairing codes or keys, your Apple Account, email address or transaction IDs.

The app does not use the advertising identifier (IDFA), does not ask to track you, and turns off Google's advertising features, so this data is not used for ads. We do not link it to your identity. Google keeps event-level data for no more than 14 months and crash reports for 90 days.

When you turn off **Share Usage Data**, the app stops sending immediately, deletes crash reports that have not been sent, and does not start the Firebase SDK again until you turn it back on. Nothing that happens while it is off is sent later. See [Google's privacy policy](https://policies.google.com/privacy) and [how Google uses data from apps that use its services](https://policies.google.com/technologies/partner-sites).

## iOS: help over FaceTime {#help-over-facetime}

From version 1.5.0, someone on a FaceTime call with you can press the keys of your TV from their own TameTV, after you allow it. This uses Apple's SharePlay:

- your iPhone or iPad shares with them the name of the TV that you allow, its platform, whether it is connected and which keys it has. It never shares the TV's address or pairing data.
- their key presses, and text they type for the TV, travel through SharePlay to your iPhone or iPad, which sends them to your TV over your Wi-Fi.

These messages go through Apple's FaceTime and SharePlay service, not through our servers, and TameTV does not keep them. Either of you can end the help at any time, and it ends with the call. See [Apple's privacy policy](https://www.apple.com/legal/privacy/).

## iOS: data stored on your device {#data-stored-on-your-device}

To reconnect to your TVs quickly, the app keeps this data on your iPhone:

- the name, model, platform, IP address and MAC address of each TV that you add,
- pairing data from the TV, for example an access token and a certificate fingerprint,
- for Android TV and Google TV, a security key and certificate that the app creates on your iPhone,
- for Apple TV, the keys that the app and the Apple TV exchange when you pair them.

The app uses this data only to connect to your TVs. It does not send this data to us or to any third party. The TV platform and model number are the only TV details included in usage statistics.

The app keeps pairing data in the iOS Keychain. iOS can keep Keychain data after you delete an app. To delete the data for a TV, remove the TV in the app (**Settings > TVs > Forget This TV**).

From version 1.5.0, if you save Tune-up's share card, the app adds that one image to your photos. The app sees only the photos and videos that you choose to cast, never the rest of your library.

## iOS: support emails {#support-emails}

If you choose **Contact Support** or **Report Problem** in the app, the app opens an email to us. It can attach a diagnostics file: the app version, iOS version, TV platforms and recent connection errors. The app removes IP addresses, MAC addresses, TV names and serial numbers from this file first. You see the email before you send it.

When you email us, we receive your email address and whatever you write. We use them only to answer you. You can ask us to delete your messages at any time.

## iOS: purchases {#purchases}

Apple processes all payments. We do not receive your name, email address or payment details. The app receives transaction information from Apple, for example which product you bought and when your subscription renews. The app uses this information only to unlock paid features.

## iOS: diagnostics from Apple {#diagnostics-from-apple}

If you turn on **Share With App Developers** in iOS Settings, Apple can share crash reports and usage statistics with us. This data does not identify you. You control this setting in **Settings > Privacy & Security > Analytics & Improvements**.

## This website

This website has no cookies, no analytics and no advertising, and it loads nothing from other sites. It is hosted on GitHub Pages. Like every web host, GitHub receives technical data when you open a page, for example your IP address. See the [GitHub privacy statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement).

## iOS: your choices and rights {#your-ios-choices-and-rights}

We do not link usage statistics and crash reports to an app account. Reports use an app installation identifier, and we do not have an account-based way to identify a particular person’s reports. The data the app uses is on your iPhone, and you control it:

- turn off **Settings > Privacy > Share Usage Data** in the app to stop usage statistics and crash reports,
- remove a TV in the app to delete its pairing data,
- clear recent links and playlists in the app,
- turn off Local Network access in **Settings > Privacy & Security > Local Network**,
- turn off camera, microphone or speech recognition access under TameTV in the Settings app,
- delete the app to remove its other data.

If you have emailed us, you can ask for a copy of that correspondence or ask us to delete it. Privacy laws in some places, for example the European Economic Area, the United Kingdom and California, give you further rights over personal data. To use them, email us.

## Children

The app is not directed to children under 13. We do not knowingly collect data from children.

## Changes to this policy

If we change how the app uses data, we will update this page and the effective date.

## Contact

If you have questions about this policy, email [{{ site.email }}](mailto:{{ site.email }}).
