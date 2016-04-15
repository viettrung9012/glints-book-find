import React from 'react';
import BookItem from './BookItem.jsx';

var BooksList = React.createClass({
  renderBooks() {
    return this.props.books.map((book, index) => {
      return (
        <div className="col s3" key={index}>
          <BookItem book={book} />
        </div>
      );
    });
  },
  render () {
    return  (
      <div className="row">
        {this.renderBooks()}
      </div>
    );
  }
});

export default BooksList;
