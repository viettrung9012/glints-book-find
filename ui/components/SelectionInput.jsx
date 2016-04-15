import React from 'react';

var SelectionInput = React.createClass({
  componentDidMount() {
    $('#langSelect').material_select();
    $('#langSelect').on('change', this.handleSelect);
  },
  handleSelect(e) {
    this.props.onChange(e.target.value);
  },
  renderOptions() {
    return this.props.options.map((option, index) =>  {
      return <option key={index} value={option}>{option}</option>
    });
  },
  render () {
    return (
      <div className="row">
        <div className="col offset-s3 s6">
          <select id="langSelect">
            {this.renderOptions()}
          </select>
        </div>
      </div>
    );
  }
});

export default SelectionInput;
