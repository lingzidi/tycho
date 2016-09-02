
var chaiSubset = require('chai-subset');
chai.use(chaiSubset);

var testsContext = require.context('.', true, /.test$/);

testsContext
  .keys()
  .forEach(testsContext);