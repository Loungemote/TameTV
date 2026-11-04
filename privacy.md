---
layout: page
title: Privacy Policy
permalink: /privacy/
eyebrow: Legal
dated: true
lead: TameTV is a TV remote for iPhone, iPad and Android. This policy explains the data used by each version.
description: Privacy information for TameTV on iOS and Android, including local TV data, casting, purchases and optional analytics.
---

## Summary

<div class="summary" markdown="1">

- TameTV has no app accounts or advertising.
- Remote commands go directly from your phone to the selected TV on your local network. We do not relay them through our servers.
- The iOS version has optional Firebase usage and crash reporting. The Android release described below has no Firebase configuration, and its Share Usage Data setting is off by default.
- Google Cast has its own diagnostic collection. Share Usage Data does not control that SDK data.
- Apple processes iOS purchases. Google Play processes Android purchases.

</div>

This policy covers TameTV on iOS and Android. The Android package is `com.pesafy.loungemote`, distributed through the Google Play developer account Saleslify Technologies. In this policy, "we" means the developer of TameTV.

## Android privacy

### Local data and TV control

The Android app stores saved TV names, local network addresses, settings and playlists on the device. Pairing records use AES-GCM with a non-exportable key in Android Keystore; for an Apple TV they include the keys that the app and the Apple TV exchange when you pair them. Android TV client keys also stay in Android Keystore. The app excludes these records from Android backups.

Remove a TV in the app to remove its saved pairing records. Clear recent links and playlists in the app to remove those entries. Android's app-data deletion controls remove the app's local records.

Remote keys and typed text go to the selected TV. For local media casting, the selected receiver reads the chosen media from a temporary HTTP server on your Android device. Keep the app open during local playback; the server stops when the app leaves the foreground. Some TV protocols and local media routes use unencrypted local transports. The app does not claim that all local traffic is encrypted.

### Google Cast and optional analytics

Google Cast can send anonymous discovery, session, mobile-device and app information to Google for SDK analytics and performance improvement. Google states that these logs use encrypted transport and that apps and users cannot disable or delete this SDK data. The Share Usage Data switch does not control it. See [Google's Cast SDK disclosure](https://developers.google.com/cast/docs/android_sender/data_disclosure) and [Google's privacy policy](https://policies.google.com/privacy).

The Android release described by this policy does not include Firebase Android configuration. Share Usage Data is off by default. If a later release enables Firebase, this policy and the Google Play data safety answers will be updated before that release.

### Google Play purchases and support

Google Play processes Android payments. The app receives product, purchase-state, purchase-token and signature information to verify purchases and restore Pro access. It verifies the purchase signature and acknowledges completed purchases. We do not receive your payment-card details.

Cancel an Android subscription through Google Play before its next renewal. Deleting the app does not cancel a subscription. Restore with the Google account used for the purchase. Google Play handles payment and refund requests.

The support address is [{{ site.email }}](mailto:{{ site.email }}). You can review a support message before sending it. A message discloses your email address and the information you include. The app can prepare diagnostics with private TV identifiers removed. We use support correspondence only to respond and you can ask us to delete it.

## iPhone and iPad privacy

The iPhone and iPad app is available on the App Store. The following sections describe the iOS version. The website, children and contact sections apply to both platforms.

## iOS: local network access {#local-network-access}

The app asks for Local Network permission. It uses this permission to:

- find TVs and streaming devices on your Wi-Fi network,
- send remote control commands to the TV that you select,
- turn on a TV with Wake-on-LAN, if you use this feature,
- send photos, videos and links that you choose to a TV or cast device.

Remote control commands stay on your local network, between your iPhone and your TV.

## iOS: casting {#casting}

When you cast a photo or video from your iPhone, the app serves that one file to the TV over your Wi-Fi network while it plays. The app serves the selected media to the receiver without uploading it to our servers. When you cast a link, the TV loads the link from the internet by itself.

Links you played recently and playlists you add are stored only on your iPhone. You can clear them in the app.

To cast to Chromecast and other Google Cast devices, the app uses Google's Cast SDK. The SDK starts only when you use casting. It sends Google diagnostic data, usage data about the cast session, a device identifier and a coarse location derived from your IP address. Google does not link this data to you, and it is not used for tracking. See [Google's privacy policy](https://policies.google.com/privacy).

## iOS: usage data and crash reports {#usage-data-and-crash-reports}

The app uses Google Analytics for Firebase and Firebase Crashlytics, services of Google, to learn which features are used, which TV platforms connect reliably, where people get stuck, and why the app crashes. This is on when you first install the app. You can turn it off at any time in the app in **Settings > Privacy > Share Usage Data**. One switch covers both usage statistics and crash reports.

When it is on, the app sends:

- events about how you use the app, for example which screen you open, whether a connection to a TV succeeds or fails and with which error, how many remote keys you press in a session (the total, not which keys), and whether a cast starts,
- the TV platform, for example Roku or Samsung, and the model number that the TV reports, for example QN65Q80,
- app settings, for example the remote layout and the app language, and whether you use the free version or TameTV Pro, with which plan,
- purchases that you make in the app: the product, price and currency,
- crash reports: the crash location in the code, the app and iOS versions, your device model, and the app events just before the crash,
- data that the Firebase SDK adds by itself: an app instance identifier created at random for this installation, your device model and iOS version, and a coarse location (country or region) that Google derives from your IP address.

The app never sends: TV names, IP or MAC addresses, Wi-Fi network names, serial numbers, text you type on the TV, the names of apps you open on the TV, what an Apple TV is playing, the names or contents of photos, videos, files and links you cast, pairing codes or keys, your Apple Account, email address or transaction IDs.

The app does not use the advertising identifier (IDFA), does not ask to track you, and turns off Google's advertising features, so this data is not used for ads. We do not link it to your identity. Google keeps event-level data for no more than 14 months and crash reports for 90 days.

When you turn off **Share Usage Data**, the app stops sending immediately, deletes crash reports that have not been sent, and does not start the Firebase SDK again until you turn it back on. Nothing that happens while it is off is sent later. See [Google's privacy policy](https://policies.google.com/privacy) and [how Google uses data from apps that use its services](https://policies.google.com/technologies/partner-sites).

## iOS: data stored on your device {#data-stored-on-your-device}

To reconnect to your TVs quickly, the app keeps this data on your iPhone:

- the name, model, platform, IP address and MAC address of each TV that you add,
- pairing data from the TV, for example an access token and a certificate fingerprint,
- for Android TV and Google TV, a security key and certificate that the app creates on your iPhone,
- for Apple TV, the keys that the app and the Apple TV exchange when you pair them.

The app uses this data only to connect to your TVs. It does not send this data to us or to any third party. The TV platform and model number are the only TV details included in usage statistics.

The app keeps pairing data in the iOS Keychain. iOS can keep Keychain data after you delete an app. To delete the data for a TV, remove the TV in the app (**Settings > TVs > Forget This TV**).

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
- delete the app to remove its other data.

If you have emailed us, you can ask for a copy of that correspondence or ask us to delete it. Privacy laws in some places, for example the European Economic Area, the United Kingdom and California, give you further rights over personal data. To use them, email us.

## Children

The app is not directed to children under 13. We do not knowingly collect data from children.

## Changes to this policy

If we change how the app uses data, we will update this page and the effective date.

## Contact

If you have questions about this policy, email [{{ site.email }}](mailto:{{ site.email }}).
