/* livescript */

var build, fs, config;
build = require('./build');
fs = require('fs');
config = require('./config');
module.exports = function(grunt){
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-livescript');
  grunt.loadNpmTasks('grunt-karma');
  grunt.initConfig({
    pkg: grunt.file.readJSON('./package.json'),
    uglify: {
      build: {
        files: {
          '<%=grunt.option("path")%>.min.js': '<%=grunt.option("path")%>.js'
        },
        options: {
          mangle: {
            keep_fnames: true
          },
          compress: {
            keep_fnames: true,
            pure_getters: true
          },
          output: {
            max_line_len: 32000
          },
          ie8: true,
          sourceMap: true,
          banner: config.banner
        }
      }
    },
    livescript: {
      src: {
        files: {
          './tests/helpers.js': './tests/helpers/*',
          './tests/tests.js': './tests/tests/*',
          './tests/library.js': './tests/library/*',
          './tests/es.js': './tests/tests/es*',
          './tests/experimental.js': './tests/experimental/*',
          './build/index.js': './build/build.ls*'
        }
      }
    },
    clean: ['./library'],
    copy: {
      lib: {
        files: [
          {
            expand: true,
            cwd: './',
            src: ['es5/**', 'es6/**', 'es7/**', 'stage/**', 'web/**', 'core/**', 'fn/**', 'index.js', 'shim.js'],
            dest: './library/'
          }, {
            expand: true,
            cwd: './',
            src: ['modules/*'],
            dest: './library/',
            filter: 'isFile'
          }, {
            expand: true,
            cwd: './modules/library/',
            src: '*',
            dest: './library/modules/'
          }
        ]
      }
    },
    watch: {
      core: {
        files: './modules/*',
        tasks: 'default'
      },
      tests: {
        files: './tests/tests/*',
        tasks: 'livescript'
      }
    },
    karma: {
      'options': {
        configFile: './tests/karma.conf.js',
        browsers: ['PhantomJS'],
        singleRun: true
      },
      'default': {},
      'library': {
        files: ['client/library.js', 'tests/helpers.js', 'tests/library.js'].map(function(it){
          return {
            src: it
          };
        })
      }
    }
  });
  grunt.registerTask('build', function(options){
    var done, ref$;
    done = this.async();
    return build({
      modules: (options || 'es5,es6,es7,js,web,core').split(','),
      blacklist: (grunt.option('blacklist') || '').split(','),
      library: (ref$ = grunt.option('library')) === 'yes' || ref$ === 'on' || ref$ === 'true',
      umd: (ref$ = grunt.option('umd')) !== 'no' && ref$ !== 'off' && ref$ !== 'false'
    }).then(function(it){
      grunt.option('path') || grunt.option('path', './custom');
      fs.writeFile(grunt.option('path') + '.js', it, done);
    })['catch'](function(it){
      console.error(it);
      process.exit(1);
    });
  });
  grunt.registerTask('client', function(){
    grunt.option('library', '');
    grunt.option('path', './client/core');
    return grunt.task.run(['build:es5,es6,es7,js,web,core', 'uglify']);
  });
  grunt.registerTask('library', function(){
    grunt.option('library', 'true');
    grunt.option('path', './client/library');
    return grunt.task.run(['build:es5,es6,es7,js,web,core', 'uglify']);
  });
  grunt.registerTask('shim', function(){
    grunt.option('library', '');
    grunt.option('path', './client/shim');
    return grunt.task.run(['build:es5,es6,es7,js,web', 'uglify']);
  });
  grunt.registerTask('e', function(){
    grunt.option('library', '' > grunt.option('path', './client/core'));
    return grunt.task.run(['build:es5,es6,es7,js,web,core,exp', 'uglify']);
  });
  return grunt.registerTask('default', ['clean', 'copy', 'client', 'library', 'shim']);
};