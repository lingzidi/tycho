
var chaiSubset = require('chai-subset');
window.should = chai.should();
chai.use(chaiSubset);

var testsContext = require.context('.', true, /.test$/);

testsContext
  .keys()
  .forEach(testsContext);