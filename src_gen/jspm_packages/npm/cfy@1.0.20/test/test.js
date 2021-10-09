/* livescript */

var cfy_module, yfy, cfy, yfy_node, cfy_node, yfy_multi, yfy_multi_node, add_noerr, co, chai, expect, add_async, add_async_node;
cfy_module = require('../index');
yfy = cfy_module.yfy, cfy = cfy_module.cfy, yfy_node = cfy_module.yfy_node, cfy_node = cfy_module.cfy_node, yfy_multi = cfy_module.yfy_multi, yfy_multi_node = cfy_module.yfy_multi_node, add_noerr = cfy_module.add_noerr;
co = require('co');
chai = require('chai');
expect = chai.expect;
chai.should();
process.on('unhandledRejection', function(reason, p){
  throw new Error(reason);
});
add_async = function(x, y, callback){
  return setTimeout(function(){
    return callback(x + y);
  }, 0);
};
add_async_node = function(x, y, callback){
  return setTimeout(function(){
    return callback(null, x + y);
  }, 0);
};
describe('all tests', function(){
  specify('cfy test callback', function(done){
    var f;
    f = cfy(function*(){
      return (yield Promise.resolve(5));
    });
    return f(function(result){
      result.should.equal(5);
      return done();
    });
  });
  specify('cfy test promise', function(done){
    var f;
    f = cfy(function*(){
      return (yield Promise.resolve(5));
    });
    return f().then(function(result){
      result.should.equal(5);
      return done();
    });
  });
  specify('cfy_node test callback', function(done){
    var f;
    f = cfy_node(function*(){
      return (yield Promise.resolve(5));
    });
    return f(function(err, result){
      result.should.equal(5);
      return done();
    });
  });
  specify('cfy_node test promise', function(done){
    var f;
    f = cfy_node(function*(){
      return (yield Promise.resolve(5));
    });
    return f().then(function(result){
      result.should.equal(5);
      return done();
    });
  });
  specify('yfy test', function(done){
    var f;
    f = cfy(function*(){
      return (yield yfy(add_async)(5, 1));
    });
    return f(function(result){
      result.should.equal(6);
      return done();
    });
  });
  specify('yfy_node test', function(done){
    var f;
    f = cfy(function*(){
      return (yield yfy_node(add_async_node)(5, 1));
    });
    return f(function(result){
      result.should.equal(6);
      return done();
    });
  });
  specify('cfy multiple arguments test', function(done){
    var f;
    f = cfy(function*(x, y){
      return 2 + 5;
    });
    return f(2, 5, function(result){
      result.should.equal(7);
      return done();
    });
  });
  specify('cfy multiple arguments nontrivial test', function(done){
    var f;
    f = cfy(function*(x, y){
      var tmp;
      tmp = (yield yfy(add_async)(3, 1));
      return tmp + x + y;
    });
    return f(2, 5, function(result){
      result.should.equal(11);
      return done();
    });
  });
  specify('cfy multiple arguments nontrivial promise test', function(done){
    var f;
    f = cfy(function*(x, y){
      var tmp;
      tmp = (yield yfy(add_async)(3, 1));
      return tmp + x + y;
    });
    return f(2, 5).then(function(result){
      result.should.equal(11);
      return done();
    });
  });
  specify('cfy yielding each other test', function(done){
    var f1, f2;
    f1 = cfy(function*(){
      return 3;
    });
    f2 = cfy(function*(){
      var tmp;
      tmp = (yield f1());
      return tmp + 1;
    });
    return f2(function(result){
      result.should.equal(4);
      return done();
    });
  });
  specify('cfy yielding each other test basic', function(done){
    var add_then_multiply, add_then_multiply_then_divide;
    add_then_multiply = cfy(function*(x, y, z){
      var tmp;
      tmp = x + y;
      return tmp * z;
    });
    add_then_multiply_then_divide = cfy(function*(x, y, z, a){
      var tmp;
      tmp = (yield add_then_multiply(x, y, z));
      return tmp / a;
    });
    return add_then_multiply(2, 4, 3, function(res1){
      res1.should.equal((2 + 4) * 3);
      return add_then_multiply_then_divide(2, 4, 3, 9, function(res2){
        res2.should.equal((2 + 4) * 3 / 9);
        return done();
      });
    });
  });
  specify('cfy yielding each other test nontrivial', function(done){
    var add_then_multiply, add_then_multiply_then_divide;
    add_then_multiply = cfy(function*(x, y, z){
      var tmp;
      tmp = (yield yfy(add_async)(x, y));
      return tmp * z;
    });
    add_then_multiply_then_divide = cfy(function*(x, y, z, a){
      var tmp;
      tmp = (yield add_then_multiply(x, y, z));
      return tmp / a;
    });
    return add_then_multiply(2, 4, 3, function(res1){
      res1.should.equal((2 + 4) * 3);
      return add_then_multiply_then_divide(2, 4, 3, 9, function(res2){
        res2.should.equal((2 + 4) * 3 / 9);
        return done();
      });
    });
  });
  specify('yield setTimeout', function(done){
    var sleep, f;
    sleep = cfy(function*(time){
      var sleep_base;
      sleep_base = function(ntime, callback){
        return setTimeout(callback, ntime);
      };
      return (yield yfy(sleep_base)(time));
    });
    f = cfy(function*(){
      var x;
      x = (yield sleep(0));
      return 5;
    });
    return f(function(result){
      result.should.equal(5);
      return done();
    });
  });
  specify('yfy redundant yfy test', function(done){
    var sleep, f;
    sleep = cfy(function*(time){
      var sleep_base;
      sleep_base = function(ntime, callback){
        return setTimeout(callback, ntime);
      };
      return (yield yfy(sleep_base)(time));
    });
    f = cfy(function*(){
      var x;
      x = (yield yfy(sleep)(0));
      return 5;
    });
    return f(function(result){
      result.should.equal(5);
      return done();
    });
  });
  specify('retain this baseline', function(done){
    var f, this$ = this;
    this.x = 3;
    f = function(callback){
      return callback(this.x);
    };
    return f(function(res1){
      return f.bind(this$)(function(res2){
        3 .should.not.equal(res1);
        3 .should.equal(res2);
        return done();
      });
    });
  });
  specify('retain this with cfy', function(done){
    var f, this$ = this;
    this.x = 3;
    f = cfy(function*(){
      return this.x;
    });
    return f(function(res1){
      return f.bind(this$)(function(res2){
        3 .should.not.equal(res1);
        3 .should.equal(res2);
        return done();
      });
    });
  });
  specify('retain this with cfy_node', function(done){
    var f, this$ = this;
    this.x = 3;
    f = cfy_node(function*(){
      return this.x;
    });
    return f(function(err1, res1){
      return f.bind(this$)(function(err2, res2){
        3 .should.not.equal(res1);
        3 .should.equal(res2);
        return done();
      });
    });
  });
  specify('cfy handle functions that yield callbacks correctly callback', function(done){
    var get5, f;
    get5 = function(){
      return 5;
    };
    f = cfy(function*(){
      return get5;
    });
    return f(function(g){
      5 .should.equal(g());
      return done();
    });
  });
  specify('cfy handle functions that yield callbacks correctly promise', function(done){
    var get5, f;
    get5 = function(){
      return 5;
    };
    f = cfy(function*(){
      return get5;
    });
    return f().then(function(g){
      5 .should.equal(g());
      return done();
    });
  });
  specify('cfy handle functions that have callbacks as arguments correctly callback', function(done){
    var get5, f;
    get5 = function(){
      return 5;
    };
    f = cfy(function*(f1){
      return f1() + f1();
    });
    return f(get5, function(g){
      10 .should.equal(g);
      return done();
    });
  });
  specify('cfy handle functions that have callbacks as arguments correctly promise', function(done){
    var get5, f;
    get5 = function(){
      return 5;
    };
    f = cfy(function*(f1){
      return f1() + f1();
    });
    return f(get5).then(function(g){
      10 .should.equal(g);
      return done();
    });
  });
  specify('yfy test with multi arg promise', function(done){
    var f;
    f = yfy(function(callback){
      return callback(3, 5);
    });
    return f().then(function(g){
      3 .should.equal(g);
      return done();
    });
  });
  specify('yfy test with multi arg callback', function(done){
    var f;
    f = yfy(function(callback){
      return callback(3, 5);
    });
    return f(function(g){
      3 .should.equal(g);
      return done();
    });
  });
  specify('yfy_node test with multi arg promise', function(done){
    var f;
    f = yfy_node(function(callback){
      return callback(null, 3, 5);
    });
    return f().then(function(g){
      3 .should.equal(g);
      return done();
    });
  });
  specify('yfy_node test with multi arg callback', function(done){
    var f;
    f = yfy_node(function(callback){
      return callback(null, 3, 5);
    });
    return f(function(err, g){
      expect(err).to.be['null'];
      3 .should.equal(g);
      return done();
    });
  });
  specify('yfy test with multi arg callback', function(done){
    var f;
    f = yfy(function(callback){
      return callback(3, 5);
    });
    return f(function(g){
      3 .should.equal(g);
      return done();
    });
  });
  specify('yfy_multi test with single arg promise', function(done){
    var f;
    f = yfy_multi(function(callback){
      return callback(3);
    });
    return f().then(function(g){
      1 .should.equal(g.length);
      3 .should.equal(g[0]);
      return done();
    });
  });
  specify('yfy_multi test with single arg callback', function(done){
    var f;
    f = yfy_multi(function(callback){
      return callback(3);
    });
    return f(function(g){
      3 .should.equal(g);
      return done();
    });
  });
  specify('yfy_multi_node test with single arg promise', function(done){
    var f;
    f = yfy_multi_node(function(callback){
      return callback(null, 3);
    });
    return f().then(function(g){
      1 .should.equal(g.length);
      3 .should.equal(g[0]);
      return done();
    });
  });
  specify('yfy_multi_node test with single arg callback', function(done){
    var f;
    f = yfy_multi_node(function(callback){
      return callback(null, 3);
    });
    return f(function(err, g){
      expect(err).to.be['null'];
      3 .should.equal(g);
      return done();
    });
  });
  specify('yfy_multi test with multi arg promise', function(done){
    var f;
    f = yfy_multi(function(callback){
      return callback(3, 5);
    });
    return f().then(function(g){
      2 .should.equal(g.length);
      3 .should.equal(g[0]);
      5 .should.equal(g[1]);
      return done();
    });
  });
  specify('yfy_multi test with multi arg callback', function(done){
    var f;
    f = yfy_multi(function(callback){
      return callback(3, 5);
    });
    return f(function(g, h){
      3 .should.equal(g);
      5 .should.equal(h);
      return done();
    });
  });
  specify('yfy_multi_node test with multi arg promise', function(done){
    var f;
    f = yfy_multi_node(function(callback){
      return callback(null, 3, 5);
    });
    return f().then(function(g){
      2 .should.equal(g.length);
      3 .should.equal(g[0]);
      5 .should.equal(g[1]);
      return done();
    });
  });
  specify('yfy_multi_node test with multi arg callback', function(done){
    var f;
    f = yfy_multi_node(function(callback){
      return callback(null, 3, 5);
    });
    return f(function(err, g, h){
      expect(err).to.be['null'];
      3 .should.equal(g);
      5 .should.equal(h);
      return done();
    });
  });
  specify('cfy specify number of arguments for variable arguments function callback', function(done){
    var f, g;
    f = function*(){
      var args, res$, i$, to$;
      res$ = [];
      for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
        res$.push(arguments[i$]);
      }
      args = res$;
      return args[0] + args[1];
    };
    0 .should.equal(f.length);
    g = cfy(f, {
      num_args: 2
    });
    return g(3, 5, function(res){
      8 .should.equal(res);
      return done();
    });
  });
  specify('cfy specify number of arguments for variable arguments function promise', function(done){
    var f, g;
    f = function*(){
      var args, res$, i$, to$;
      res$ = [];
      for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
        res$.push(arguments[i$]);
      }
      args = res$;
      return args[0] + args[1];
    };
    0 .should.equal(f.length);
    g = cfy(f, {
      num_args: 2
    });
    return g(3, 5).then(function(res){
      8 .should.equal(res);
      return done();
    });
  });
  specify('cfy_node specify number of arguments for variable arguments function callback', function(done){
    var f, g;
    f = function*(){
      var args, res$, i$, to$;
      res$ = [];
      for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
        res$.push(arguments[i$]);
      }
      args = res$;
      return args[0] + args[1];
    };
    0 .should.equal(f.length);
    g = cfy_node(f, {
      num_args: 2
    });
    return g(3, 5, function(err, res){
      expect(err).to.be['null'];
      8 .should.equal(res);
      return done();
    });
  });
  specify('cfy_node specify number of arguments for variable arguments function promise', function(done){
    var f, g;
    f = function*(){
      var args, res$, i$, to$;
      res$ = [];
      for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
        res$.push(arguments[i$]);
      }
      args = res$;
      return args[0] + args[1];
    };
    0 .should.equal(f.length);
    g = cfy_node(f, {
      num_args: 2
    });
    return g(3, 5).then(function(res){
      8 .should.equal(res);
      return done();
    });
  });
  specify('cfy varargs option callback', function(done){
    var f, g;
    f = function*(){
      var args, res$, i$, to$;
      res$ = [];
      for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
        res$.push(arguments[i$]);
      }
      args = res$;
      return args.reduce(curry$(function(x$, y$){
        return x$ + y$;
      }), 0);
    };
    0 .should.equal(f.length);
    g = cfy(f, {
      varargs: true
    });
    return g(3, 5, 7, function(res){
      15 .should.equal(res);
      return done();
    });
  });
  specify('cfy varargs option promise', function(done){
    var f, g;
    f = function*(){
      var args, res$, i$, to$;
      res$ = [];
      for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
        res$.push(arguments[i$]);
      }
      args = res$;
      return args.reduce(curry$(function(x$, y$){
        return x$ + y$;
      }), 0);
    };
    0 .should.equal(f.length);
    g = cfy(f, {
      varargs: true
    });
    return g(3, 5, 7).then(function(res){
      15 .should.equal(res);
      return done();
    });
  });
  specify('cfy_node varargs option callback', function(done){
    var f, g;
    f = function*(){
      var args, res$, i$, to$;
      res$ = [];
      for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
        res$.push(arguments[i$]);
      }
      args = res$;
      return args.reduce(curry$(function(x$, y$){
        return x$ + y$;
      }), 0);
    };
    0 .should.equal(f.length);
    g = cfy_node(f, {
      varargs: true
    });
    return g(3, 5, 7, function(err, res){
      expect(err).to.be['null'];
      15 .should.equal(res);
      return done();
    });
  });
  specify('cfy_node varargs option promise', function(done){
    var f, g;
    f = function*(){
      var args, res$, i$, to$;
      res$ = [];
      for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
        res$.push(arguments[i$]);
      }
      args = res$;
      return args.reduce(curry$(function(x$, y$){
        return x$ + y$;
      }), 0);
    };
    0 .should.equal(f.length);
    g = cfy_node(f, {
      varargs: true
    });
    return g(3, 5, 7).then(function(res){
      15 .should.equal(res);
      return done();
    });
  });
  specify('add_null_err test', function(done){
    var f;
    f = function(it){
      return it(3);
    };
    return f(function(g){
      3 .should.equal(g);
      return add_noerr(f)(function(err, h){
        expect(err).to.be['null'];
        3 .should.equal(h);
        return done();
      });
    });
  });
  specify('yield thunk test', function(done){
    var g;
    g = cfy(function*(){
      return (yield function(cb){
        return cb(null, 3);
      });
    });
    return g(function(res){
      3 .should.equal(res);
      return done();
    });
  });
  specify('yield thunk test add_noerr', function(done){
    var g;
    g = cfy(function*(){
      return (yield add_noerr(function(it){
        return it(3);
      }));
    });
    return g(function(res){
      3 .should.equal(res);
      return done();
    });
  });
  return specify('cfy directly callable', function(done){
    var f;
    f = cfy_module(function*(){
      return 3;
    });
    return f(function(res){
      3 .should.equal(res);
      return done();
    });
  });
});
function curry$(f, bound){
  var context,
  _curry = function(args) {
    return f.length > 1 ? function(){
      var params = args ? args.concat() : [];
      context = bound ? context || this : this;
      return params.push.apply(params, arguments) <
          f.length && arguments.length ?
        _curry.call(context, params) : f.apply(context, params);
    } : f;
  };
  return _curry();
}