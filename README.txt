Study Rhythm (installable web app)

Files (keep them together in one folder):
  index.html            the app
  manifest.webmanifest  name, colours and icons for "install"
  sw.js                 lets the app open offline
  icons/                app icons

Publish: put this folder on any HTTPS web host (for example GitHub Pages).
Open the https address on your phone, then use "Install app" (Android Chrome) or
Share > Add to Home Screen (iPhone Safari).

Your checkmarks are saved on the device, in that browser/app only.
No accounts, no tracking, no sync.

To release an update: change VERSION in sw.js and APP_VERSION in index.html to the
same new number, then upload the changed files over the old ones.
