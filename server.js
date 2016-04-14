var express = require('express'),
    Promise = require('bluebird'),
    constants = require('./constants'),
    scrape = require('./utils/scrape'),
    mongoose = require('mongoose'),
    Book = require('./models/book');

var app = express();
app.use(express.static('public'));
app.get('/', function(req, res) {
 res.sendFile(__dirname + '/index.html');
});
app.get('/api/books/:skill', function(req, res) {
  Book.find({skill: req.params.skill}, function(err, results){
    res.send(results);
  });
});
var server = app.listen(3000, function() {
  mongoose.connect(constants.MONGO_SERVER);
  Book.count({}, function(err, count) {
    if (err) throw err;
    if (count === 0)  {
      console.log('Scraping started');
      var langs = [];
      constants.PROGRAMMING_LANGUAGES.forEach(function(lang){
        langs.push(function() {
          return new Promise(function(resolve){
            scrape(lang)
            .then(function(res){
              res.forEach(function(e){
                e.skill = lang;
                var newBook = Book(e);
                newBook.save(function(err) {
                  if (err) {
                    resolve('Book not inserted to DB');
                  } else {
                    resolve('Book insert to DB');
                  }
                });
              });
            });
          });
        }());
      });
      Promise.all(langs).then(function(){
        console.log('Scraping completed');
      });
    }
  });
  var port = server.address().port;
  console.log('Server running at http:\/\/localhost:' + port);
});
