const orbitalCompiler = require('./lib/orbitalCompiler');
const ephemeris = require('./lib/ephemeris');
const orbitalUpdater = require('./lib/orbitalUpdater');

const runScript = (cmd) => {
  switch (cmd) {
    case 'orbitals':
      return orbitalCompiler.compileBundles();
    case 'ephemeris':
      return orbitalUpdater.updateAll();
    default:
      return false;
  }
}

runScript(process.argv[2]);
