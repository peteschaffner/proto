#!/usr/bin/env node

/**
 * Module dependencies.
 */

var builder = require('./builder');
var connect = require('connect');
var gaze = require('gaze');
var livereload = require('connect-livereload');
var LivereloadServer = require('tiny-lr');
var program = require('commander');
var resolve = require('path').resolve;

// cli
program
  .version(require('../package.json').version)
  .usage('[options] [dir]')
  .option('-p, --port <port>', 'specify the port [3000]', Number, 3000)
  .parse(process.argv);

// path
var path = resolve(program.args.shift() || '.');

// setup the server
var server = connect();

// logging
server.use(connect.logger('dev'));

// livereload
var lrserver = new LivereloadServer();
var port = 35729;

lrserver.listen(port);

gaze(['*.html', '*.css', '*.js', 'lib/**/*'], { cwd: path }, function () {
  this.on('all', function (event, filepath) {
    // sanitize our file path
    var fp = filepath.replace(/\s/g, '%20');
    // tell LiveReload what changed
    lrserver.changed({
      body: {
        files: fp
      }
    });
  });
});

server.use(livereload({ port: port }));

// component
server.use(builder({ path: '/build/build' }));

// static files
server.use(connect.static(path));

// start the server
server.listen(program.port, function () {
  console.log('\033[90mserving \033[36m%s\033[90m on port \033[96m%d\033[0m', path, program.port);
});
