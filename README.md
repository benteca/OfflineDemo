# OfflineDemo

This is a small demo app for showing some PWA concepts.
- Offline support: The current version of the Service Worker `sw.js` is not in a perfect state. It pretty much does the job, but I would recommend trying out something like Workbox to create the Service Worker. It still gives an idea on how it works with caching and the different "states" of the service worker.
- Update on new version: A `NewVersionBanner.jsx` will be shown if there is a new Service Worker available. By clicking "Update" a message will be posted to the service worker to "Skip Waiting". The new version will then be activated.
- Storing to local storage: In `Counter.js` the state of the counter is saved to local storage.

There is also a `Documentation.md` file that shows the bare minimum that must be in place in order to get an installable PWA.

This project is pretty much the basic "Create react app" in Visual Studio, that is, it is an ASP.NET Core React App with the template menu and content.
