import React from 'react';
import {render} from 'react-dom';
import $ from 'jquery';
import constants from '../constants.js';
import SelectionInput from './components/SelectionInput.jsx';
import BooksList from './components/BooksList.jsx';

var App = React.createClass({
  getInitialState() {
    return {
      books: []
    };
  },
  componentDidMount() {
    this.getBooks(constants.PROGRAMMING_LANGUAGES[0]);
  },
  handleSelection(str) {
    this.getBooks(str);
  },
  getBooks(str) {
    var self = this,
        url = '/api/books/' + str;
    $.ajax(url).done((books) => {
      self.setState({books: books});
    });
  },
  render () {
    return <div className="container">
      <SelectionInput
        options={constants.PROGRAMMING_LANGUAGES}
        onChange={this.handleSelection}
        />
      <BooksList
        books={this.state.books}
        />
    </div>;
  }
});

render(<App/>, document.getElementById('app'));
