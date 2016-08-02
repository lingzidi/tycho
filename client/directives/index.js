import Directives from './directives';

let directives = [
  'timepicker'
];

export default directives.map((directiveName) => {
  return Directives.registerDirective(directiveName, 'bodyInfo');
});