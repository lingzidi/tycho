<p align="center">
  <img src="https://raw.githubusercontent.com/jshor/tycho2/develop/public/static/img/logo-gradient-dark.png" width="450" height="75" />
</p>

<br>

[![codecov](https://codecov.io/gh/jshor/tycho2/branch/develop/graph/badge.svg)](https://codecov.io/gh/jshor/tycho2)
[![Build Status](https://travis-ci.org/jshor/tycho2.svg?branch=master)](https://travis-ci.org/jshor/tycho2)
[![dependency Status](https://david-dm.org/jshor/tycho2/status.png)](https://david-dm.org/jshor/tycho2#info=dependencies)
[![devDependency Status](https://david-dm.org/jshor/tycho2/dev-status.png)](https://david-dm.org/jshor/tycho2#info=devDependencies)

## Table of Contents

- [About This Project](#about-this-project)
- [Development](#development)
  - [Package Management](#package-management)
  - [Framework + Libraries](#framework-libraries)
  - [Styling](#styling)
  - [Testing](#testing)
    - [Testing Guidelines](#testing-guidelines)
- [Application Flow](#application-flow)
- [Application Architecture](#application-architecture)
  - [Routing](#routing)
  - [State management](#state-management)
- [Folder Structure](#folder-structure)
- [Available Scripts](#available-scripts)
  - [yarn build-css](#yarn-build-css)
  - [yarn start](#yarn-start)
  - [yarn test](#yarn-test)
  - [yarn coverage](#yarn-coverage)
  - [yarn build](#yarn-build)
- [Supported Language Features and Polyfills](#supported-language-features-and-polyfills)
- [Credits](#credits)

## About This Project

This is a real-time, WebGL-based, 3D visualization of our Solar System. It's a complete re-write of the [original Tych.io](https://github.com/jshor/tycho.io) project. Check out the full experience at [tycho.io](http://tycho.io).

## Development

### Package Management

Using [Yarn](https://yarnpkg.com/en/).

### Framework + Libraries

This app is built using [React.js](https://facebook.github.io/react/)/[Redux](http://redux.js.org/), [THREE.js](https://threejs.org), and uses [react-three-renderer]() for THREE-based React components. It's bootstrapped using [Create React App](https://github.com/facebookincubator/create-react-app).

### Styling

Each DOM component contains a corresponding [Sass](http://sass-lang.com/) stylesheet and employs the [BEM](http://getbem.com/) CSS design pattern. This app uses [node-sass-chokidar](https://www.npmjs.com/package/node-sass-chokidar) for Sass compilation.

### Testing

Tests use [Jest](https://facebook.github.io/jest/) and [snapshot testing](https://facebook.github.io/jest/docs/en/snapshot-testing.html#content) for components.

#### Testing Guidelines

* The importance of code coverage should not supercede the importance of writing good quality tests. 
* Methods for containers should contain a corresponding unit test, and is ideally written as a pure function.
* For exceptions, such as when a local state is updated, there should be a corresponding integration test.
* Components should be [snapshot tested](https://facebook.github.io/jest/docs/en/snapshot-testing.html#content).
* Do [TDD](https://en.wikipedia.org/wiki/Test-driven_development) and [BDD](https://en.wikipedia.org/wiki/Behavior-driven_development) (recommended).

## Application Flow

TODO

## Application Architecture

The overall architecture uses the [React/Redux container pattern](http://www.thegreatcodeadventure.com/the-react-plus-redux-container-pattern/). In a nutshell, containers in this app leverage tasks such as handling state and minor front-end logic, while components simply handle the presentation. Physics calculations and business logic is delegated to services, and some critical components, such as the Camera, have dedicated services.

### Routing

There's only one route: the home page.

### State management

All shared-state data is stored in the Redux store. This includes the 2D and 3D positions of objects and the current time. This enables unidirectional data flow (read: [advantages of Redux](https://www.reddit.com/r/javascript/comments/3w8uey/what_are_the_real_benefits_of_using_fluxredux/)). In rare cases, some components will use the local state for things internal to that component, when appropriate.

## Folder Structure

```
./src
|-- ./actions
  |   |-- ./actions/<type>Actions.js
  |   `-- ./actions/__tests__
  |       |-- ./actions/__tests__/<type>Actions.test.js
  |       |-- ./actions/__tests__/__fixtures__
  |-- ./components
  |   |-- ./components/Slider
  |   |   |-- ./components/Slider/<slider>
  |   |   |   |   `-- ./components/Slider/<slider>/__snapshots__/
  |   |   |   |   `-- ./components/Slider/ScaleSlider/__snapshots__/
  |   |       |-- ./components/Slider/Slider/Slider.scss
  |   |       |-- ./components/Slider/Slider/Slider.test.jsx
  |   |       |-- ./components/Slider/Slider/__snapshots__
  |   |       |-- ./components/Slider/Slider/index.js
  |   |       |-- ./components/Slider/Slider/Slider.jsx
  |   |-- ./components/<component>
  |   |   |-- ./components/<component>/index.js
  |   |   |-- ./components/<component>/<component>.test.jsx
  |   |   |-- ./components/<component>/__snapshots__
  |   |   `-- ./components/<component>/<component>.jsx
  |-- ./constants
  |   |-- ./constants/<constant>.js
  `-- ./containers
      |-- ./containers/<type>Container.jsx
      `-- ./containers/__tests__
          |-- ./containers/__tests__/<type>Container.test.jsx
          |-- ./containers/__tests__/__fixtures__
          |-- ./containers/__tests__/__snapshots__
  |-- ./reducers
  |   |-- ./reducers/<type>Reducer.js
  |   |-- ./reducers/index.js
  |   `-- ./reducers/__tests__
  |       |-- ./reducers/__tests__/index.test.js
  |       |-- ./reducers/__tests__/<type>Reducer.test.js
  |-- ./services
  |   |-- ./services/<service>.js
  |   `-- ./services/__tests__

  |-- ./utils
  |   |-- ./utils/<util>.js
  |   |-- ./utils/__tests__
  |   |   |-- ./utils/__tests__/<util>.test.js
  |   |   |-- ./utils/__tests__/__fixtures__
  |   `-- ./utils/materials
  |       |-- ./utils/materials/<material>Material.js
  |       `-- ./utils/materials/__tests__
  |           |-- ./utils/materials/__tests__/<material>Material.test.js
  |-- ./store
  |   |-- ./store/__tests__
  |   |   `-- ./store/__tests__/index.test.js
  |   `-- ./store/index.js
  |-- ./index.js
```

## Available Scripts

In the project directory, you can run:

### `yarn build-css`

Compiles all Sass files in the `src/` directory. The file path is the CSS equivalent for each Sass file.

### `yarn start`

Runs the app in the development mode.<br>
It will also build the CSS using `build-css`.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br>

### `yarn coverage`

Runs all tests and outputs code test covfefe.<br>

### `yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.<br>
It also runs the compilation script for the orbital data json.<br>
The build is minified and the filenames include the hashes.<br>

### `yarn orbitals`

Runs the compilation script for the orbital data json.

## Supported Language Features and Polyfills

This project supports a superset of the latest JavaScript standard.<br>
In addition to [ES6](https://github.com/lukehoban/es6features) syntax features, it also supports:

* [Exponentiation Operator](https://github.com/rwaldron/exponentiation-operator) (ES2016).
* [Async/await](https://github.com/tc39/ecmascript-asyncawait) (ES2017).
* [Object Rest/Spread Properties](https://github.com/sebmarkbage/ecmascript-rest-spread) (stage 3 proposal).
* [Dynamic import()](https://github.com/tc39/proposal-dynamic-import) (stage 3 proposal)
* [Class Fields and Static Properties](https://github.com/tc39/proposal-class-public-fields) (stage 2 proposal).
* [JSX](https://facebook.github.io/react/docs/introducing-jsx.html).

Learn more about [different proposal stages](https://babeljs.io/docs/plugins/#presets-stage-x-experimental-presets-).

The following ES6 **[polyfills](https://en.wikipedia.org/wiki/Polyfill)** are available:

* [`Object.assign()`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) via [`object-assign`](https://github.com/sindresorhus/object-assign).
* [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) via [`promise`](https://github.com/then/promise).
* [`fetch()`](https://developer.mozilla.org/en/docs/Web/API/Fetch_API) via [`whatwg-fetch`](https://github.com/github/fetch).

## Credits

* Project developed by [Josh Shor](http://josh.so)
* Planetary ephemerides courtesy of [NASA](https://jpl.nasa.gov/) and the [Jet Propulsion Laboratory](https://www.nasa.gov/).
* Orbital textures by [James Hastings-Trew](http://planetpixelemporium.com/).
* Atmospheric scattering and illumination material shaders by Sean O'Neil and James Baicoianu.
* Ambient music [*Ultra Deep Field*](https://soundcloud.com/stellardrone/stellardrone-ultra-deep-field) by [Stellardrone](https://soundcloud.com/stellardrone).
* Special thanks to the open source community for [React.js](https://facebook.github.io/react/)/[Redux](http://redux.js.org/), [THREE.js](https://threejs.org), and [react-three-renderer](). 
