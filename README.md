# OfflineDemo

This is a small demo app for showing some PWA concepts.
- Offline support: The current version of the Service Worker `sw.js` is not in a perfect state. It pretty much does the job, but I would recommend trying out something like Workbox to create the Service Worker. 
- Update on new version: A `NewVersionBanner.jsx` will be shown if there is a new Service Worker available. By clicking "Update" a message will be posted to the service worker to "Skip Waiting". The new version will then be activated.
