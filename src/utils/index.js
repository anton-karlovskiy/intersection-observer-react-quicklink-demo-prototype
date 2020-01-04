
import { listen } from './quicklink/index.mjs';

const listenWithRmanifest = async () => {
  if (!window._rmanifest_) {
    const response = await fetch('/rmanifest.json');
    window._rmanifest_ = await response.json();
  }

  const rmanifest = window._rmanifest_;
  let chunks = {};
  for (const routeURL in rmanifest) {
    if (rmanifest.hasOwnProperty(routeURL) && routeURL !== '*') {
      const chunksForRoute = rmanifest[routeURL];
      const assetURLs = chunksForRoute.map(chunkForRoute => chunkForRoute.href);
      chunks = {...chunks, [routeURL]: assetURLs};
    }
  }
  
  console.log('ray : ***** chunks => ', chunks);
  listen({chunks});
};

export {
  listenWithRmanifest
};
