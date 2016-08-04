var chai = require('chai'),
    assert = chai.assert,
    expect = chai.expect,
    should = chai.should;

    chai.should();

var testsContext = require.context('.', true, /.test$/);

testsContext
  .keys()
  .forEach(testsContext);