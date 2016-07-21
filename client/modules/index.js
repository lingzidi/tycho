import ModulesService from './modules.service'; 

let Module = new ModulesService();
let modules = [
  'sign_in'
];

modules.forEach(Module.registerLess);

modules = modules.map((moduleName) => Module.registerModule(moduleName));

module.exports = modules;