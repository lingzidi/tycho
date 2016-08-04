var chai = require('chai'),
    chaiSubset = require('chai-subset'),
    assert = chai.assert,
    expect = chai.expect,
    should = chai.should;

chai.use(chaiSubset);
chai.should();

var testsContext = require.context('.', true, /.test$/);

testsContext
  .keys()
  .forEach(testsContext);