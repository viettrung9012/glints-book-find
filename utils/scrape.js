var request = require('request'),
    cheerio = require('cheerio'),
    Promise = require('bluebird');

var getHTMLResponse = function(url) {
  return new Promise(function(resolve, reject){
    if (!url) {
      reject('No URL');
    }
    request.get(url, {timeout: 5000}, function(err, res, html) {
      if (!err) {
        resolve(html);
      } else {
        reject('Request Error');
      }
    });
  });
};

var getBookDetails = function(url) {
  return new Promise(function(resolve){
    getHTMLResponse(url)
    .then(function(html){
      var startIndex = html.indexOf('bookDescEncodedData = "') + 23;
      if (startIndex === 22) { // might be due to amazon blocking bot
        resolve('');
      } else {
        var endIndex = html.indexOf('"', startIndex),
            descriptionElRaw = html.substring(startIndex, endIndex),
            description = unescape(descriptionElRaw);
        resolve(description);
      }
    })
    .catch(function(err){
      resolve('');
    });
  });
};

var getAuthorDetails = function(url) {
  return new Promise(function(resolve) {
    url = 'http://www.amazon.com' + url;
    getHTMLResponse(url)
    .then(function(html){
      var bio= cheerio.load(html)('div#ap-bio div.a-expander-content>span').text();
      resolve(bio);
    })
    .catch(function(err){
      resolve('');
    });
  });
};

var scrape = function(str) {
  return new Promise(function(resolve) {
    var url = 'http://www.amazon.com/s/?field-keywords=' + str;
    getHTMLResponse(url)
    .then(function(html) {
      var $ = cheerio.load(html);
      var books = [];
      $('li.s-result-item').each(function() {
        var self = this;
        books.push(function() {
          return new Promise(function(resolve){
            var builder = new BookBuilder();
            builder.setTitle($(self).find('h2.s-access-title').text())
                   .setAuthorName($(self).find('.a-spacing-small>div>span>a').text())
                   .setPrice($(self).find('span.a-color-price.s-price').first().text())
                   .setRatings($(self).find('i.a-icon-star>span').text().split(' ')[0])
                   .setCover($(self).find('.s-access-image').attr('src'));
            Promise.join(getBookDetails($(self).find('a.s-access-detail-page').attr('href')), getAuthorDetails($(self).find('.a-spacing-small>div>span>a').attr('href')),
                function(description, authorBio) {
                  builder.setDescription(description)
                         .setAuthorBio(authorBio);
                  resolve(builder.getObj());
            });
          });
        }());
      });
      Promise.all(books).then(function(results){
        resolve(results);
      });
    })
    .catch(function(err) {
      resolve([]);
    });
  });
};

var BookBuilder = function() {
  var self = this;
  this.obj = {author: {}};
  this.setTitle = function(title) {
    self.obj.title = title;
    return self;
  };
  this.setAuthorName = function(name) {
    self.obj.author.name = name;
    return self;
  };
  this.setAuthorBio = function(bio) {
    self.obj.author.bio = bio;
    return self;
  };
  this.setDescription = function(des) {
    self.obj.description = des;
    return self;
  };
  this.setCover = function(cover) {
    self.obj.cover = cover;
    return self;
  };
  this.setPrice = function(price) {
    self.obj.price = price;
    return self;
  };
  this.setRatings = function(ratings) {
    self.obj.ratings = ratings;
    return self;
  };
  this.getObj = function() {
    return self.obj;
  };
};


module.exports = scrape;
