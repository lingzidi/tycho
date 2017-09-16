const glob = require('glob');
const path = require('path');
const fs = require('fs');

/**
 * Returns JSON data from the given file path.
 *
 * @param {String} filePath - path to JSON file
 * @returns {Object} JSON-parsed contents of given file
 */
const getJsonData = (filePath) => {
  return require(filePath);
}

/**
 * Extracts the file name from the given file path.
 *
 * @param {String} filePath - path to JSON file
 * @returns {String} file name from given path
 */
const getKeyFromPath = (filePath) => {
  return filePath
    .replace(/^.*[\\\/]/, '')
    .replace('.json', '');
}

/**
 * Bundles all JSONs from the given paths to one object.
 * The keys will be the file name of the given file path.
 *
 * @param {String[]} filePaths - list of JSON file paths
 * @returns {Object} flat object with JSON data
 */
const jsonFilesToObject = (filePaths) => {
  let data = {};

  filePaths.forEach((filePath) => {
    const key = getKeyFromPath(filePath);
    data[key] = getJsonData(filePath);
  });

  return data;
}

/**
 * Removes satellites from the given object.
 *
 * @param {Object} mapping - with satellites mapped
 * @returns {Object} data with satellites removed
 */
const removeSatellites = (mapping, satellites) => {
  satellites.forEach((satellite) => {
    delete mapping[satellite];
  });
  return mapping;
}

/**
 * Maps satellites to their parents.
 * Satellites will be removed from the flat map.
 *
 * @param {Object} data - flat data
 * @returns {Object} data with satellites mapped
 */
const mapSatellitesToParents = (data) => {
  let mapping = {};
  let satelliteKeys = [];

  for (const id in data) {
    const {satellites} = data[id];

    if (Array.isArray(satellites)) {
      data[id].satellites = satellites
        .map((satellite) => {
          satelliteKeys.push(satellite);
          return Object.assign(data[satellite], {id});
        })
      .filter((satellite) => !!satellite);
    }
    mapping[id] = data[id];
  }

  return removeSatellites(mapping, satelliteKeys);
}

/**
 * Flattens key-value orbital data structure to array.
 * Assigns the key as the `id` property of the given orbital.
 *
 * @param {Object} orbitalData - key/value pair of orbital data
 * @returns {Object[]} array of orbitals
 */
const orbitalsToArray = (orbitalData) => {
  let data = [];

  for (const id in orbitalData) {
    data.push(
      Object.assign({}, orbitalData[id], {id})
    );
  }
  return data;
}

/**
 * Returns all *.json files recursively in the given path.
 *
 * @param {String} pathName - base path to look in
 * @returns {String[]} list of paths to JSON files.
 */
const getFilePaths = (pathName) => {
  return glob.sync(path.join(__dirname, '../public/static/data/orbitals/**/*.json'));
}

/**
 * Compiles data from the given base path.
 *
 * @param {String} basePath - base path for json files
 * @returns {String} JSON-stringified data bundle
 */
const getOrbitalDataBundle = () => {
  const filePaths = getFilePaths();
  const jsonData = jsonFilesToObject(filePaths);
  const orbitalsObj = mapSatellitesToParents(jsonData);
  const orbitalsArr = orbitalsToArray(orbitalsObj);

  return JSON.stringify(orbitalsArr);
}

/**
 * Writes the given data to the specified file.
 *
 * @param {String} data - JSON-encoded data
 * @param {String} fileName - name of JSON file to write
 */
const compileDataFile = (data, fileName) => {
  const filePath = path.join(__dirname, `../build/static/data/${fileName}.json`);

  fs.writeFile(filePath, data, (err) => {
    if (err) {
      return console.log('Error: ', err);
    }
    console.log(`Created bundle in: ${filePath}`);
  }); 
}

/**
 * Compiles all bundles.
 */
const compileBundles = () => {
  compileDataFile(getOrbitalDataBundle(), 'orbitals');
}

compileBundles();
