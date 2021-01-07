self.addEventListener('install', evt => {
    console.log('service worker has been installed.');
});

self.addEventListener('activate', evt => {
    console.log('service worker has been activated.');
});

this.addEventListener('fetch', function (event) {
    // it can be empty if you just want to get rid of that error
});