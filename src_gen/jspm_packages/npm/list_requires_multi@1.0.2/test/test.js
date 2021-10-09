/* livescript */

var list_requires, chai, expect;
list_requires = require('../index');
chai = require('chai');
expect = chai.expect;
chai.should();
process.on('unhandledRejection', function(reason, p){
  throw new Error(reason);
});
describe('all tests', function(){
  specify('list_requires bare', function(done){
    var result;
    result = list_requires('require("foo")');
    result.should.eql({
      require: ['foo']
    });
    return done();
  });
  specify('list_requires with assignment', function(done){
    var result;
    result = list_requires('bar = require("foo")');
    result.should.eql({
      require: ['foo']
    });
    return done();
  });
  specify('list_requires function', function(done){
    var result;
    result = list_requires("function qux() {\n  return require(\"moo\")\n}");
    result.should.eql({
      require: ['moo']
    });
    return done();
  });
  specify('list_requires multiple', function(done){
    var result;
    result = list_requires("function qux() {\n  return require(\"moo\")\n}\nrequire(\"bar\")\nvar c = require(\"non\") ? require(\"lala\") : require(\"nana\")");
    result.require.length.should.equal(5);
    result.require.should.include.members(['moo', 'bar', 'non', 'lala', 'nana']);
    return done();
  });
  return specify('list_requires_async', function(done){
    var result;
    result = list_requires("async function qux() {\n  return require(\"moo\")\n}");
    result.should.eql({
      require: ['moo']
    });
    return done();
  });
});