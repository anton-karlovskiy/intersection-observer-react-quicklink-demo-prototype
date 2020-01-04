
import { useEffect, useRef, useState } from 'react';
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

const useIntersect = ({ root = null, rootMargin, threshold = 0 }) => {
  const [entry, updateEntry] = useState({});
  const [node, setNode] = useState(null);

  const observer = useRef(null);

  useEffect(
    () => {
      if (observer.current) observer.current.disconnect();

      observer.current = new window.IntersectionObserver(
        ([entry]) => updateEntry(entry),
        {
          root,
          rootMargin,
          threshold
        }
      );

      const { current: currentObserver } = observer;

      if (node) currentObserver.observe(node);

      return () => currentObserver.disconnect();
    },
    [node, root, rootMargin, threshold]
  );

  return [setNode, entry];
};

export {
  listenWithRmanifest,
  useIntersect
};
