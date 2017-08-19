var chaiSubset = require('chai-subset');
var spy = chai.spies;
var should = chai.should();
chai.use(chaiSubset);

var testsContext = require.context('.', true, /.test$/);


testsContext
  .keys()
  .forEach(testsContext);
