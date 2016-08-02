import Modules from './modules'; 

let modules = [
  'main',
  'bodyInfo'
];

modules.forEach(Modules.registerLess);

modules = modules.map((moduleName) => {
  return Modules.registerModule(moduleName);
});

module.exports = modules;