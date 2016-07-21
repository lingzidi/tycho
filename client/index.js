import routing from './config';
import modules from './modules';

angular
  .module('app', modules)
  .config(routing);