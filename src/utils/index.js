
import React, { useEffect, useRef, useState } from 'react';
import { listen } from './quicklink/index.mjs';

const listenWithChunks = async options => {
  const { routeManifestURL, ...restOptions } = options;
  
  if (!window._chunks_) {
    try {
      const response = await fetch(routeManifestURL);
      const rmanifest = await response.json();

      window._chunks_ = {};
      for (const routeURL in rmanifest) {
        if (rmanifest.hasOwnProperty(routeURL) && routeURL !== '*') {
          const chunksForRoute = rmanifest[routeURL];
          const assetURLs = chunksForRoute.map(chunkForRoute => chunkForRoute.href);
          window._chunks_ = {...window._chunks_, [routeURL]: assetURLs};
        }
      }
    } catch (error) {
      console.log('[listenWithChunks] error => ', error);
      return;
    }
  }
  const chunks = window._chunks_;
  
  console.log('ray : ***** chunks => ', chunks);
  listen({chunks, ...restOptions});
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

const withQuicklink = (Component, options) => {
	return () => {
		const [ref, entry] = useIntersect({root: document.body.parentElement});
    const intersectionRatio = entry.intersectionRatio;
    
		useEffect(() => {
			console.log('ray : ***** [App withQuicklink callback] intersectionRatio => ', intersectionRatio);
			if (intersectionRatio > 0) {
        console.log('ray : ***** [App withQuicklink callback] we call quicklink as intersectionRatio is ', intersectionRatio, ', which is greater than zero');
        listenWithChunks(options);
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
