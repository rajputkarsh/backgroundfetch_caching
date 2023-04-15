import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { URLS } from './constants';

function App() {

  // const fetchImages = async () => {
  //   console.log('Fetching Images, total - ', URLS.length);
  //   let registration = await navigator.serviceWorker.ready;

  //   // @ts-ignore1
  //   const response = await registration.backgroundFetch.fetch(
  //     'KFC-Images', 
  //     URLS,
  //     {
  //       title: "ABCD",
  //       icons: [
  //         {
  //           sizes: "300x300",
  //           src: "/vite.svg",
  //           type: "image/svg",
  //         },
  //       ],
  //       downloadTotal: 60 * 1024 * 1024,
  //     }          
  //   );

  //   if ('serviceWorker' in navigator) {
  //     window.addEventListener('load', () => {
  //       navigator.serviceWorker.register('/service-worker.js');
  //     });
  //   }
  // }

  // useEffect(() => {
  //   fetchImages();
  // });



  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
