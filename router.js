var routes = require('i40')(),
        fs = require('fs'),
        db = require('monk')('localhost/music'),
     movies = db.get('movies'),
        qs = require('qs'),
      // view = require('mustache'),
      mime = require('mime');

var view = require('./view.js');

routes.addRoute('/movies', function (req, res, url) {
  res.setHeader('Content-Type', 'text/html');
  if (req.method === 'GET') {
    movies.find({}, function(err, docs) {
      if (err) {throw err; }
      else {
        var template = view.render('movies/index', {movies: docs});
        res.end(template);
      }
    });
  }
});

routes.addRoute('/movies/landing', function (req, res, url) {
  res.setHeader('Content-Type', 'text/html');
  if (req.method === 'GET') {
    movies.find({}, function(err, docs) {
      if (err) {throw err; }
      else {
        var template = view.render('movies/landing', {movies: docs});
        res.end(template);
      }
    });
  }
});

routes.addRoute('/movies/new', function (req, res, url) { // url is never used
  res.setHeader('Content-Type', 'text/html');
  if (req.method === 'GET') {
    var template = view.render('movies/new', {});
    res.end(template);
  }
  if (req.method === 'POST') {
    var data = '';
    req.on('data', function(chunk){
      data += chunk;
    });
      req.on('end', function(){
      var movie = qs.parse(data);
      movies.insert(movie, function(err, doc) { // doc is never used
        if (err) {res.end('error'); }
        else {
          res.writeHead(302, {'Location': '/movies'});
          res.end();
        }
      });
    });
  }
});

routes.addRoute('/movies/:id/edit', function (req, res, url) { // url is never used
  res.setHeader('Content-Type', 'text/html');
  if (req.method === 'GET') {
    movies.findOne({_id: url.params.id}, function(err, doc) {
      if (err) {throw err; }
      else {
        var template = view.render('movies/edit', {movies: doc});
        res.end(template);
      }
    });
  }
  if (req.method === 'POST') {
    var data = '';
    req.on('data', function(chunk){
      data += chunk;
    });
    req.on('end', function(){
      var movie = qs.parse(data);
        movies.update({_id: url.params.id}, movie, function(err, doc) { // doc is never used
          if (err) {res.end('error'); }
          else {
            res.writeHead(302, {'Location': '/movies'});
            res.end();
          }
        });

    });
  }
});

routes.addRoute('/movies/:id/delete', function (req, res, url) {
  if (req.method === 'POST') {
    movies.remove({_id: url.params.id}, function(err, doc) {
      if (err) {throw err; }
      else {
        res.writeHead(302, {'Location': '/movies'});
        res.end();
      }
    });
  }
});

routes.addRoute('/movies/:id/show', function (req, res, url) {
  res.setHeader('Content-Type', 'text/html');
  if (req.method === 'GET') {
    movies.findOne({_id: url.params.id}, function(err, doc) {
      if (err) {throw err; }
      else {
        var template = view.render('movies/show', {movies: doc});
        res.end(template);
      }
    });
  }
});

routes.addRoute('/public/*', function (req, res, url) {
  res.setHeader('Content-Type', mime.lookup(req.url));
  fs.readFile('./' + req.url, function (err, file) {
    if (err) {
      res.setHeader('Content-Type', 'text/html');
      res.end('404');
    }
    else {
      res.end(file);
    }
  });
});

module.exports = routes;
