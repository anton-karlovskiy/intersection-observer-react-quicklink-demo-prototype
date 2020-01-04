
import React, { useEffect, useRef, useState } from 'react';
import { listen } from './quicklink/index.mjs';

const ROUTE_MANIFEST_PATH = '/rmanifest.json';

const listenWithChunks = async () => {
  if (!window._rmanifest_) {
    const response = await fetch(ROUTE_MANIFEST_PATH);
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

const withQuicklink = Component => {
	return () => {
		const [ref, entry] = useIntersect({root: document.body.parentElement});
    const intersectionRatio = entry.intersectionRatio;
    
		useEffect(() => {
			console.log('ray : ***** [App withQuicklink callback] intersectionRatio => ', intersectionRatio);
			if (intersectionRatio > 0) {
				console.log('ray : ***** [App withQuicklink callback] we call quicklink as intersectionRatio is ', intersectionRatio, ', which is greater than zero');
				listenWithChunks();
			}
		}, [intersectionRatio]);
		
		return (
			<div ref={ref}>
				<Component />
			</div>
		);
	};
};

export {
  withQuicklink
};
