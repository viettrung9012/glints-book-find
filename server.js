var express = require('express'),
    Promise = require('bluebird'),
    constants = require('./constants'),
    scrape = require('./utils/scrape'),
    mongoose = require('mongoose'),
    Book = require('./models/book');

var app = express();
app.use(express.static('public'));
app.use(express.static('node_modules/materialize-css/dist'));
app.use('/js',express.static('node_modules/jquery/dist'));
app.get('/', function(req, res) {
 res.sendFile(__dirname + '/index.html');
});
app.get('/api/books/:skill', function(req, res) {
  if (req.params.skill) {
    Book.find({skill: req.params.skill}, function(err, results){
      if (!err) {
        res.send(results);
      } else {
        res.send([]);
      }
    });
  } else {
    res.send([]);
  }
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
