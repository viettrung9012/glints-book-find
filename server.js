var express = require('express');
var Promise = require('bluebird');
var constants = require('./constants');
var scrape = require('./utils/scrape');
var mongoose = require('mongoose');
var Book = require('./models/book');

var app = express();
app.use(express.static('public'));
app.get('/', function(req, res) {
 res.sendFile(__dirname + '/index.html');
});
var server = app.listen(3000, function() {
  mongoose.connect('mongodb://localhost:27017/books');
  constants.PROGRAMMING_LANGUAGES.forEach(function(lang){
    scrape(lang)
    .then(function(res){
      res.forEach(function(e){
        console.log(e.title);
        console.log(e.authorName);
        console.log(e.authorBio);
        console.log(e.price);
        console.log(e.ratings);
        console.log(e.cover);
        console.log(e.description);
        var newBook = Book({
          skill: lang,
          title: e.title,
          author: {
            name: e.authorName,
            bio: e.authorBio
          },
          price: e.price,
          ratings: e.ratings,
          cover: e.cover,
          description: e.description
        });
        newBook.save(function(err) {
          if (err) throw err;
          console.log('Book inserted!');
        });
      });
    });
  });
  var port = server.address().port;
  console.log('Server running at http:\/\/localhost:' + port);
});
