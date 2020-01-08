
## Installation

```sh
git clone https://github.com/anton-karlovskiy/intersection-observer-react-quicklink-demo.git
npm install
npm run dev
npm run build
npm start
```

## How to setup

1. Install [webpack-route-manifest](https://github.com/lukeed/webpack-route-manifest) package.

2. Configure webpack with `webpack-route-manifest`.

    * [intersection-observer-react-quicklink-demo](https://glitch.com/~anton-karlovskiy-intersection-observer-react-quicklink-demo) project example  
    https://glitch.com/edit/#!/anton-karlovskiy-intersection-observer-react-quicklink-demo?path=config/webpack.config.js:671:6
    https://glitch.com/edit/#!/anton-karlovskiy-intersection-observer-react-quicklink-demo?path=src/components/App/index.js:27:0
    https://glitch.com/edit/#!/anton-karlovskiy-intersection-observer-react-quicklink-demo?path=config/webpack.config.js:316:16

    * [cra-hover-prefetch](https://github.com/anton-karlovskiy/cra-hover-prefetch) project example  
    https://github.com/anton-karlovskiy/cra-hover-prefetch/blob/5744672055016b93a0eeb572b8163d3f833b9400/config/webpack.config.js#L660
    https://github.com/anton-karlovskiy/cra-hover-prefetch/blob/708d713a2e874a8b1120867980116b8df9d3cea5/src/App.js#L8

3. Install [quicklink](https://github.com/GoogleChromeLabs/quicklink) package.
Currently it's not available because the new chunks feature is still in the [PR](https://github.com/GoogleChromeLabs/quicklink/pull/156) and not published yet. So please install this [version](https://github.com/anton-karlovskiy/quicklink/tree/feature/with-react) in your react project using `npm link/yarn link`.

4. Put `withQuicklink` HOC in your project like [here](https://glitch.com/edit/#!/anton-karlovskiy-intersection-observer-react-quicklink-demo?path=src/lib/quicklink.js:57:2).

  ```js
  import React, { useEffect, useRef, useState } from 'react';
  import { listen } from 'quicklink';

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
    return props => {
      const [ref, entry] = useIntersect({root: document.body.parentElement});
      const intersectionRatio = entry.intersectionRatio;
      
      useEffect(() => {
        if (intersectionRatio > 0) {
          listen(options);
        }
      }, [intersectionRatio]);
      
      return (
        <div ref={ref}>
          <Component {...props} />
        </div>
      );
    };
  };

  export {
    withQuicklink
  };
  ```

5. Wrap all your code-splitted route components with above `withQuicklink` HOC based on setting [quicklink options](https://github.com/GoogleChromeLabs/quicklink#quicklinklistenoptions) with `routeManifestURL` as second argument like [here](https://glitch.com/edit/#!/anton-karlovskiy-intersection-observer-react-quicklink-demo?path=src/components/App/index.js:24:52).

  ```js
  import { withQuicklink } from '../../lib/quicklink';

  const options = {
    routeManifestURL: '/rmanifest.json' // path to the route manifest file by webpack-route-manifest
  };

  <Suspense fallback={<div>Loading...</div>}>
    <Route path="/" exact component={withQuicklink(Home, options)} />
    <Route path="/blog" exact component={withQuicklink(Blog, options)} />
    <Route path="/blog/:title" component={withQuicklink(Article, options)} />
    <Route path="/about" exact component={withQuicklink(About, options)} />
  </Suspense>
  ```

## Glitch Source

* [Link to Glitch App](https://anton-karlovskiy-intersection-observer-react-quicklink-demo.glitch.me/)
* [Link to Project on Glitch](https://glitch.com/~anton-karlovskiy-intersection-observer-react-quicklink-demo)
