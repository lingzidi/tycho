
var chaiSubset = require('chai-subset');
var spy = chai.spies;
var should = chai.should();
chai.use(chaiSubset);

var testsContext = require.context('.', true, /.test$/);

console.log(' ****************************************************** Context: ', testsContext.keys());

testsContext
  .keys()
  .forEach(testsContext);