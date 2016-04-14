var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var bookSchema = new Schema({
  title: { type: String, required: true},
  skill: { type: String, required: true},
  author: {
    name: String,
    bio: String
  },
  price: String,
  ratings: String,
  cover: String,
  description: String
});

var Book = mongoose.model('Book', bookSchema);

// make this available to our users in our Node applications
module.exports = Book;
