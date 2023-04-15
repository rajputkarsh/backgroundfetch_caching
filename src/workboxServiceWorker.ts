import { Workbox } from 'workbox-window';

export default function registerServiceWorker() {
  // Check if the serviceWorker Object exists in the navigator object ( means if browser supports SW )
  console.log('------------registering SW--------------');
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('../sw.js', { scope: '/' });

    wb.addEventListener('installed', event => {
      console.log('------------service worker installed------------');
      /**
       * We have the condition — event.isUpdate because we don’t want to show
       * this message on the very first service worker installation,
       * only on the updated
       */
      if (event.isUpdate) {
        if (window.confirm(`New app update is available!. Click OK to refresh`)) {
          window.location.reload();
        }
      }
    });
    wb.register();
    console.log('------------ SW REGISTERED------------');
  }
}
