list_requires = require('../index')

require! {
  chai
}

{expect} = chai
chai.should()

process.on 'unhandledRejection', (reason, p) ->
  throw new Error(reason)

describe 'all tests', ->

  specify 'list_requires bare', (done) ->
    result = list_requires('require("foo")')
    result.should.eql({require: ['foo']})
    done()

  specify 'list_requires with assignment', (done) ->
    result = list_requires('bar = require("foo")')
    result.should.eql({require: ['foo']})
    done()

  specify 'list_requires function', (done) ->
    result = list_requires """
    function qux() {
      return require("moo")
    }
    """
    result.should.eql({require: ['moo']})
    done()

  specify 'list_requires multiple', (done) ->
    result = list_requires """
    function qux() {
      return require("moo")
    }
    require("bar")
    var c = require("non") ? require("lala") : require("nana")
    """
    result.require.length.should.equal(5)
    result.require.should.include.members(['moo', 'bar', 'non', 'lala', 'nana'])
    done()

  specify 'list_requires_async', (done) ->
    result = list_requires """
    async function qux() {
      return require("moo")
    }
    """
    result.should.eql({require: ['moo']})
    done()
