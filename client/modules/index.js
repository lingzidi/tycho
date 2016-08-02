import Modules from './modules'; 

let modules = [
  'bodyInfo'
];

modules.forEach(Modules.registerLess);

modules = modules.map((moduleName) => {
  return Modules.registerModule(moduleName);
});

module.exports = modules;