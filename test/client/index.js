console.log('running tests...');

var testsContext = require.context('.', true, /.test$/);

testsContext
  .keys()
  .forEach(testsContext);