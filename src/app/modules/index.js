import Modules from './modules'; 

let bundles = [
  'main',
  'bodyInfo'
];

let modules = new Modules;

module.exports = bundles.map(modules.registerModule);