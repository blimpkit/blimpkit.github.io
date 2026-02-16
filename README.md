# BlimpKit

BlimpKit is an AngularJS directive/component UI library based on the <a href="https://sap.github.io/fundamental-styles/">fundamental-styles</a> CSS library.

While it mostly follows the fundamental style guides, it deviates in some places and some of the widgets are modified and/or removed, therefore it should not be viewed as an official implementation.

BlimpKit is its own library and contains some extra components that are unique to it.

## Themes

Officially, there are two themes available.

- BlimpKit - This is the default theme and it has light, dark and auto modes.
- Classic - SAP Quartz-based theme. The differences are minimal.
- Mystic - Clean, minimal light-only theme.

## Building the Project

Follow the steps below to install dependencies and build the library.

### 1. Install Project Dependencies

Install the main project dependencies:

```bash
npm i
```

### 2. Build the Project

To generate a production build of the library:

```bash
npm run build
```

## Working with the Documentation

The documentation site has its own dependency setup and build process.

### 1. Install Documentation Dependencies

```bash
npm run docs:install
```

### 2. Build the Documentation

```bash
npm run docs:build
```

### 3. Run the Documentation Locally

To start the documentation site locally:

```bash
npm run start
```

This will launch the documentation server and make it available for local development and preview.
