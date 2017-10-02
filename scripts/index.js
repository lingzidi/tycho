const orbitalCompiler = require('./lib/orbitalCompiler');
const ephemeris = require('./lib/ephemeris');

const runScript = (cmd) => {
  switch (cmd) {
    case 'orbitals':
      return orbitalCompiler.compileBundles();
    case 'ephemeris':
      return console.log('will do ephmemeris');
    default:
      return false;
  }
}

runScript(process.argv[2]);
