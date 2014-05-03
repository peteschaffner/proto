var express = require('express');
var gaze = require('gaze');
var livereload = require('connect-livereload');
var logger = require('morgan');
var lrserver = require('tiny-lr')();
var resolve = require('path').resolve;
var serveComponent = require('component-middleware');
var serveStatic = require('serve-static');

// app
var app = express();

// ports
var port = 3000;
var lrPort = 35729;

// resolve the root directly
var root = resolve(__dirname);

// logger
app.use(logger('dev'));

// livereload
lrserver.listen(lrPort);
// watch for changes
gaze(['index.html', 'lib/**/*'], { cwd: root }, function () {
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
// add livereload script to response
app.use(livereload({ port: lrPort }));

// serve build.js and build.css
app.use('/build', serveComponent({ prefix: '/' }));
// serve component files and dependencies
app.use(serveStatic(root));

// bind
app.listen(port);
console.log('Prototype running on port ' + port + '.');