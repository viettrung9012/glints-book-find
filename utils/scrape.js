var request = require('request');
var cheerio = require('cheerio');
var Promise = require('bluebird');

var getBookDetails = function(url) {
  return new Promise(function(resolve){
    if (!url) {
      resolve({cover: '', description: ''});
    }
    request(url, function(error, response, html) {
      if (!error) {
        var $ = cheerio.load(html);
        var coverUrl = $('div#main-image-container img#imgBlkFront').attr('src');
        var toSearchFrom = html.indexOf('bookDescEncodedData');
        var startIndex = html.indexOf('"', toSearchFrom) + 1;
        var endIndex = html.indexOf('"', startIndex);
        var descriptionElRaw = html.substring(startIndex, endIndex);
        var description = unescape(descriptionElRaw);
        resolve({cover: coverUrl, description: description});
      } else {
        resolve({cover: '', description: ''});
      }
    });
  });
};

var getAuthorDetails = function(url, callback) {
  return new Promise(function(resolve) {
    if (!url) {
      resolve({authorBio: ''});
    }
    url = 'http://www.amazon.com' + url;
    request(url, function(error, response, html) {
      if (!error) {
        var $ = cheerio.load(html);
        var authorBio= $('div#ap-bio div.a-expander-content>span').text();
        resolve({authorBio: authorBio});
      } else {
        resolve({authorBio: ''});
      }
    });
  });
};

var scrape = function(str) {
  return new Promise(function(resolve) {
    var url = 'http://www.amazon.com/s/?field-keywords=' + str;
    request(url, function(error, response, html) {
      if(!error) {
        var $ = cheerio.load(html);
        var books = [];
        $('li.s-result-item').each(function() {
          var self = this;
          books.push(function() {
            return new Promise(function(resolve){
              var book = {};
              book.title = $(self).find('h2.s-access-title').text();
              book.authorName = $(self).find('.a-spacing-small>div>span>a').text();
              book.price = $(self).find('span.a-color-price.s-price').first().text();
              book.ratings = $(self).find('i.a-icon-star>span').text().split(' ')[0];
              var bookUrl = $(self).find('a.s-access-detail-page').attr('href');
              var authorUrl = $(self).find('.a-spacing-small>div>span>a').attr('href');
              Promise.join(getBookDetails(bookUrl), getAuthorDetails(authorUrl),
                  function(bookDetails, authorDetails) {
                    book.authorBio = authorDetails.authorBio;
                    book.cover = bookDetails.cover;
                    book.description = bookDetails.description;
                    resolve(book);
              });
            });
          }());
        });
        Promise.all(books).then(function(results){
          resolve(results);
        });
      } else {
        resolve([]);
      }
    });
  });
};

module.exports = scrape;
