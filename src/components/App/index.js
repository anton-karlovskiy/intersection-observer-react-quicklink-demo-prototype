/*
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { lazy, Suspense, useEffect } from 'react';
import { Route } from 'react-router-dom';

import Footer from '@components/Footer';
import Hero from '@components/Hero';
// ray test touch <
import { listenWithRmanifest, useIntersect } from '../../utils';
// ray test touch >
import style from './index.module.css';

const Home = lazy(() => import(/* webpackChunkName: "home" */ '@pages/Home'));
const About = lazy(() => import(/* webpackChunkName: "about" */ '@pages/About'));
const Article = lazy(() => import(/* webpackChunkName: "article" */ '@pages/Article'));
const Blog = lazy(() => import(/* webpackChunkName: "blog" */ '@pages/Blog'));

const withQuicklink = Component => {
	return () => {
		// ray test touch <
		// useEffect(() => {
		// 	const target = document.querySelector('#route-component');
		// 	const options = {
		// 		root: document.body.parentElement,
		// 		rootMargin: '0px'
		// 	};
		// 	const callback = entries => {
		// 		const intersectionRatio = entries[0].intersectionRatio;
		// 		console.log('ray : ***** [App withQuicklink callback] intersectionRatio => ', intersectionRatio);
		// 		if (intersectionRatio > 0) {
		// 			console.log('ray : ***** [App withQuicklink callback] we call quicklink as intersectionRatio is ', intersectionRatio, ', which is greater than zero');
		// 			listenWithRmanifest();
		// 		}
		// 	};
		// 	const observer = new IntersectionObserver(callback, options);
		// 	observer.observe(target);
		// }, []);
		const [ref, entry] = useIntersect({root: document.body.parentElement});
		const intersectionRatio = entry.intersectionRatio;
		useEffect(() => {
			console.log('ray : ***** [App withQuicklink callback] intersectionRatio => ', intersectionRatio);
			if (intersectionRatio > 0) {
				console.log('ray : ***** [App withQuicklink callback] we call quicklink as intersectionRatio is ', intersectionRatio, ', which is greater than zero');
				listenWithRmanifest();
			}
		}, [intersectionRatio]);
		// ray test touch >
		
		return (
			// ray test touch <
			<div ref={ref}>
				<Component />
			</div>
			// ray test touch >
		);
	};
};

const App = () => (
	<div className={style.app}>
		<Hero />
		<main className={style.wrapper}>
			<Suspense fallback={<div>Loading...</div>}>
				<Route path="/" exact component={withQuicklink(Home)} />
				<Route path="/blog" exact component={withQuicklink(Blog)} />
				<Route path="/blog/:title" component={withQuicklink(Article)} />
				<Route path="/about" exact component={withQuicklink(About)} />
			</Suspense>
		</main>
		<Footer />
	</div>
);

export default App;
