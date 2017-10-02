const fs = require('fs');
const path = require('path');

/**
 * Regex patterns
 */
const JULIAN_DAY_PATTERN = '([0-9\\.]+)\\s*=\\s*A\\.D\\.[^\\n]+';

const NUMBER_VAR_PATTERN = '([A-z]{1,2})\\s*\=\\s*([0-9\\.E\\-\\+]+)';

const NUMBER_SET_PATTERN = `(${JULIAN_DAY_PATTERN}\\n(\\s*(${NUMBER_VAR_PATTERN})+\\s*)+)\\n`;

/**
 * Astronomical constants.
 */
const ONE_DAY_TO_SECONDS = 31540000;

const GRAVITATIONAL_CONSTANT = 6.67408e-11; // TODO: move to front-end?

/**
 * Returns key/value set separated by '='
 *
 * @param {String} v - numerical entry
 * @returns {Object} key/value pair of entry
 */
const getNumberVar = (v) => {
  const entry = v.split('=');
  const key = entry[0].trim();
  const value = entry[1].trim();

  return {
    [key]: parseFloat(value)
  };
}

/**
 * Converts Julian days to UNIX timestamp.
 *
 * @param {Number} julian - time, in Julian calendar days
 * @returns {Number} UNIX timestamp
 */
const julianToUnix = (julian) => {
  return (julian - 2440587.5) * 86400.0;
}

/**
 * Returns object of periapsis data from the given list of data sets.
 *
 * @param {Object[]} list - list of data sets
 * @returns {Object} in format {last, next}
 */
const getPeriapses = (list) => {
  let last, next;
  let minValue = Infinity;
  let maxValue = Infinity;
  let lastValue = 0;

  list.forEach((item) => {
    const isMaxSet = maxValue !== Infinity;

    if (item.TA < lastValue) {
      if (!isMaxSet) {
        maxValue = lastValue;
        next = julianToUnix(item.Tp);
      } else if (minValue === Infinity) {
        minValue = item.TA;
        last = julianToUnix(item.Tp);
      }
    }
    lastValue = item.TA;
  });
  return {last, next};
}

/**
 * Extracts numerical results from string sets and maps them to an object.
 * 
 * @param {String[]} sets - strings of data
 * @returns {Object[]} data sets in hashmap format
 */
const mapToDataSets = (sets) => {
  return sets.map((set) => {
    const vars = set.match(new RegExp(NUMBER_VAR_PATTERN, 'g'));
    let data = {};

    vars.forEach((v) => {
      Object.assign(data, getNumberVar(v));
    });

    return data;
  });
}

/**
 * Calculates semiminor axis from eccentricity and semimajor.
 *
 * @param {Number} eccentricity - elliptical eccentricity
 * @param {Number} semimajor - semimajor axis
 * @returns {Number} semiminor axis
 */
const getSemiminorAxis = (eccentricity, semimajor) => {
  return semimajor * Math.sqrt(1 - Math.pow(eccentricity, 2));
}

/**
 * Returns data in Tycho format.
 * See Github wiki page on Tycho data format.
 *
 * @param {String[]} sets - NASA-generated ephemeris data block
 * @returns {Object} Tycho-format data
 */
const getTychoData = (sets) => {
  const dataSets = mapToDataSets(sets);
  const dataSet = dataSets[0];
  const periapses = getPeriapses(dataSets);
  const semiminor = getSemiminorAxis(dataSet.EC, dataSet.A);

  return {
    argPeriapsis: dataSet.W,
    eccentricity: dataSet.EC,
    longAscNode: dataSet.OM,
    semimajor: dataSet.A,
    semiminor,
    periapses
  };
}

/**
 * Returns a data set from the raw response from NASA ephemerides.
 *
 * @param {String} raw - raw response data
 * @returns {Object} data params in Tycho format (see Github wiki page)
 */
const getDataFromRaw = ({rawData}) => {
  const sets = rawData.match(new RegExp(NUMBER_SET_PATTERN, 'g'));

  if (Array.isArray(sets)) {
    return getTychoData(sets);
  }
  return {};
}

//const raw = fs.readFileSync(path.join(__dirname, './rawData.txt')).toString();
//getDataFromRaw(raw)
//console.log(getDataFromRaw(raw));
module.exports = {
  getNumberVar,
  julianToUnix,
  getPeriapses,
  mapToDataSets,
  getSemiminorAxis,
  getTychoData,
  getDataFromRaw
};

