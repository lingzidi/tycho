import Directives from './directives';

let directives = [
  'timepicker'
];

directives = directives.map((directiveName) => {
  return Directives.registerDirective(directiveName, 'bodyInfo');
});

module.exports = directives;