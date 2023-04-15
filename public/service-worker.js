/* eslint-disable no-console */
// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://bit.ly/CRA-PWA


function registerValidSW(swUrl, config) {
    console.log(`\n_+_+_+_+_+_+_+_+_+_+_+_+ registering valid SW +_+_+_+_+_+_+_+_+_+_+_+_+_+_\n`);
    navigator.serviceWorker
        .register(swUrl, {
            scope: '/',
        })
        .then((registration) => {
            console.log(`registration -> `, registration);
            registration.onupdatefound = () => {
                console.log(`installingWorker -> `, installingWorker)
                const installingWorker = registration.installing;
                if (installingWorker == null) {
                    return;
                }
                installingWorker.onstatechange = () => {
                    console.log(`installingWorker.state -> `, installingWorker.state);
                    if (installingWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            // At this point, the updated precached content has been fetched,
                            // but the previous service worker will still serve the older
                            // content until all client tabs are closed.
                            console.log(
                                'New content is available and will be used when all ' +
                                'tabs for this page are closed. See https://bit.ly/CRA-PWA.'
                            );

                            // Execute callback
                            if (config && config.onUpdate) {
                                config.onUpdate(registration);
                            }
                        } else {
                            // At this point, everything has been precached.
                            // It's the perfect time to display a
                            // "Content is cached for offline use." message.
                            console.log('Content is cached for offline use.');

                            // Execute callback
                            if (config && config.onSuccess) {
                                config.onSuccess(registration);
                            }
                        }
                    }
                };
            };
        })
        .catch((error) => {
            console.error('Error during service worker registration:', error);
        });
}

function checkValidServiceWorker(swUrl, config) {
    console.log(`\n_+_+_+_+_+_+_+_+_+_+_+_+ checkValidServiceWorker +_+_+_+_+_+_+_+_+_+_+_+_+_+_\n`);
    // Check if the service worker can be found. If it can't reload the page.
    fetch(swUrl, {
        headers: { 'Service-Worker': 'script' },
    })
        .then((response) => {
            // Ensure service worker exists, and that we really are getting a JS file.
            console.log(`\n_+_+_+_+_+_+_+_+_+_+_+_+ Ensure service worker exists +_+_+_+_+_+_+_+_+_+_+_+_+_+_\n`);

            const contentType = response.headers.get('content-type');
            if (
                response.status === 404 ||
                (contentType != null && contentType.indexOf('javascript') === -1)
            ) {
                console.log(`\n_+_+_+_+_+_+_+_+_+_+_+_+ SW not found url=${swUrl} response = `, response);
                // No service worker found. Probably a different app. Reload the page.
                navigator.serviceWorker.ready.then((registration) => {
                    console.log(`registration = `, registration);
                    registration.unregister().then(() => {
                        window.location.reload();
                    });
                });
            } else {
                // Service worker found. Proceed as normal.
                console.log(`\n_+_+_+_+_+_+_+_+_+_+_+_+ sw found +_+_+_+_+_+_+_+_+_+_+_+_+_+_\n`);
                registerValidSW(swUrl, config);
            }
        })
        .catch(() => {
            console.log('No internet connection found. App is running in offline mode.');
        });
}

console.log('[Service Worker]: Consoles');
self.addEventListener('backgroundfetchsuccess', event => {
    console.log('[Service Worker]: Background Fetch Success', event.registration);
    event.waitUntil(
        (async function () {
            try {
                // Iterating the records to populate the cache
                const cache = await caches.open(event.registration.id);
                const records = await event.registration.matchAll();
                const promises = records.map(async record => {
                    const response = await record.responseReady;
                    await cache.put(record.request, response);
                });
                await Promise.all(promises);

                // [Optional] This could be an API call to our backend
                let assetsDataResponse = await fetch(
                    `/assets/${event.registration.id}-data.json`
                );
                let assetsData = await assetsDataResponse.json();

                // Updating UI
                await event.updateUI({
                    title: `${assetsData.title} is ready`,
                    icons: assetsData.icons
                });
            } catch (err) {
                console.log('Background Fetch Failed');
                await event.updateUI({
                    title: `${assetsData.title} failed: ${event.registration.failureReason
                        }`
                });
            }
        })()
    );
});

self.addEventListener('install', event => {
    console.log('[Service Worker]: Installed');
    // event.waitUntil((event) => {
    //   caches.open(event.registration.id).then((cache) => {
    //     return cache.addAll(files);
    //   });
    // });
});

self.addEventListener('message', event => {
    console.log('CUSTOM EVENT ---- ', event?.data);
    if (!event?.data?.validUrls || !Array.isArray(event?.data?.validUrls)) return;
    console.log('adding to cache');
    event.data.validUrls.forEach((url) => {
        fetch(url, { mode: 'no-cors' })
            .then((response) => {
                console.log('adding - ', url, '   resp - ', response);
                let copy = response.clone();
                caches.open('products').then((cache) => {
                    console.log('cached - ', url);
                    cache.put(url, copy);
                });
            })
            .catch((error) => {
                console.trace('fetch error   ==> ', error);
            });
    });
});

self.addEventListener('activate', async (event) => {
    console.log('[Service Worker]: Active  ', event.currentTarget.registration);

    event.currentTarget.registration.backgroundFetch.fetch(
      'KFC-Images', 
        ["https://kfcprodnecmsimage.azureedge.net/cmsimages/imagestemp/icon_address_type_delivery_grey.png"],
      {
        title: "ABCD",
        icons: [
          {
            sizes: "300x300",
            src: "/vite.svg",
            type: "image/svg",
          },
        ],
        downloadTotal: 60 * 1024 * 1024,
      }          
    ).then((resp) => {
        console.log('fetching finished -- ', resp);
    }).catch((err) => {
        console.log(`err ==> `, err);
    });

    
    
});

self.addEventListener('backgroundfetchfail', event => {
    console.log('[Service Worker]: Background Fetch Fail', event.registration);

    event.waitUntil(
        (async function () {
            try {
                const cache = await caches.open(event.registration.id);
                const records = await event.registration.matchAll();
                const promises = records.map(async record => {
                    const response = await record.responseReady
                    if (response && response.ok) {
                        await cache.put(record.request, response);
                    }
                });
                await Promise.all(promises);
            } catch(err){
                console.log('erroor in failed event ==> ', err)
            }
        })()
    );
});

self.addEventListener('backgroundfetchabort', event => {
    console.log('[Service Worker]: Background Fetch Abort', event.registration);
    console.error('Aborted by the user. No data was saved.');
});

self.addEventListener('backgroundfetchclick', event => {
    console.log('[Service Worker]: Background Fetch Click', event.registration);
});