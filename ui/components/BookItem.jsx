import React from 'react';

var BookItem = React.createClass({
  componentDidMount() {
    $('#trigger-' + this.props.book._id).click(() => {
      $('#modal-' + this.props.book._id).openModal();
    });
    $('#collapsible-' + this.props.book._id).collapsible({
      accordion : false
    });
  },
  render() {
    return (
      <div className="card medium hoverable modal-trigger" id={'trigger-' + this.props.book._id}>
        <div className="card-image">
          <img src={this.props.book.cover} />
        </div>
        <div className="card-content">
          <h6 className="truncate"><strong>{this.props.book.title}</strong></h6>
          {this.props.book.author.name ? <h6>by {this.props.book.author.name}</h6> : ''}
          <hr/>
          <div className="row">
            <div className="col s4">{this.props.book.price ? <strong>{this.props.book.price}</strong> : ''}</div>
            <div className="col s8">{this.props.book.ratings ? <span>Ratings: <strong>{this.props.book.ratings}/5</strong></span> : ''}</div>
          </div>
        </div>
        <div id={'modal-' + this.props.book._id} className="modal bottom-sheet">
          <div className="modal-content">
              <h1><strong>{this.props.book.title}</strong></h1>
              <p dangerouslySetInnerHTML={{__html: this.props.book.description}}></p>
              {(this.props.book.author.name && this.props.book.author.bio) ?
                (
                <div>
                  <h1><strong>About {this.props.book.author.name}</strong></h1>
                  <p dangerouslySetInnerHTML={{__html: this.props.book.author.bio}}></p>
                </div>
                )
              : ''}
          </div>
        </div>
      </div>
    );
  }
});

export default BookItem;
