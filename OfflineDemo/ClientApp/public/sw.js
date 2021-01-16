self.addEventListener('install', evt => {
    console.log('service worker has been installed.');
});

self.addEventListener('activate', evt => {
    console.log('service worker has been activated.');
});

this.addEventListener('fetch', function (event) {
    console.log('fetching: ' + event);
});

