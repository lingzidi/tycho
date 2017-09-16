<p align="center">
  <img src="https://raw.githubusercontent.com/jshor/tycho2/develop/public/static/img/logo-gradient-dark.png" width="450" height="75" />
</p>

<br>

[![codecov](https://codecov.io/gh/jshor/tycho2/branch/develop/graph/badge.svg)](https://codecov.io/gh/jshor/tycho2)
[![Build Status](https://travis-ci.org/jshor/tycho2.svg?branch=master)](https://travis-ci.org/jshor/tycho2)
[![dependency Status](https://david-dm.org/jshor/tycho2/status.png)](https://david-dm.org/jshor/tycho2#info=dependencies)
[![devDependency Status](https://david-dm.org/jshor/tycho2/dev-status.png)](https://david-dm.org/jshor/tycho2#info=devDependencies)

Below you will find some information on how to perform common tasks.<br>

## Table of Contents

- [About This Project](#about-this-project)
- [Technologies](#technologies)
- [Application Architecture](#application-architecture)
- [Folder Structure](#folder-structure)
- [Available Scripts](#available-scripts)
  - [yarn start](#yarn-start)
  - [yarn test](#yarn-test)
  - [yarn build](#yarn-build)
- [Supported Language Features and Polyfills](#supported-language-features-and-polyfills)

## About This Project

This is a real-time, WebGL-based, 3D visualization of our Solar System.

## Technologies

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). It's built using [react](), [react-three-renderer]() and [THREE.js]().

## Application Architecture

TODO

## Folder Structure

TODO

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br>

### `yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.<br>
The build is minified and the filenames include the hashes.<br>

## Supported Language Features and Polyfills

This project supports a superset of the latest JavaScript standard.<br>
In addition to [ES6](https://github.com/lukehoban/es6features) syntax features, it also supports:

* [Exponentiation Operator](https://github.com/rwaldron/exponentiation-operator) (ES2016).
* [Async/await](https://github.com/tc39/ecmascript-asyncawait) (ES2017).
* [Object Rest/Spread Properties](https://github.com/sebmarkbage/ecmascript-rest-spread) (stage 3 proposal).
* [Dynamic import()](https://github.com/tc39/proposal-dynamic-import) (stage 3 proposal)
* [Class Fields and Static Properties](https://github.com/tc39/proposal-class-public-fields) (stage 2 proposal).
* [JSX](https://facebook.github.io/react/docs/introducing-jsx.html) and [Flow](https://flowtype.org/) syntax.

Learn more about [different proposal stages](https://babeljs.io/docs/plugins/#presets-stage-x-experimental-presets-).

Note that **the project only includes a few ES6 [polyfills](https://en.wikipedia.org/wiki/Polyfill)**:

* [`Object.assign()`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) via [`object-assign`](https://github.com/sindresorhus/object-assign).
* [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) via [`promise`](https://github.com/then/promise).
* [`fetch()`](https://developer.mozilla.org/en/docs/Web/API/Fetch_API) via [`whatwg-fetch`](https://github.com/github/fetch).

If you use any other ES6+ features that need **runtime support** (such as `Array.from()` or `Symbol`), make sure you are including the appropriate polyfills manually, or that the browsers you are targeting already support them.
