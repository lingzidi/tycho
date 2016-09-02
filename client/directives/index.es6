import Directives from './directives';

let bundles = [
  'timepicker'
];

let directives = new Directives;

export default bundles.map((bundleName) => {
  return directives.registerDirective(bundleName, 'main');
});