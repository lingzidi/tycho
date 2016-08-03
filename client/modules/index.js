import Modules from './modules'; 

let bundles = [
  'main',
  'bodyInfo'
];

let modules = new Modules;

let registerBundle = (bundleName) => {
  require(`./${bundleName}/${bundleName}.less`);
  modules.registerModule(bundleName);
};

bundles.forEach((moduleName) => {
  registerBundle(moduleName);
});

module.exports = bundles;