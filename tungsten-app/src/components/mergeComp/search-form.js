import React, { Component } from "react";

class SearchForm extends Component {
  render() {
    // this.props are the properties which are provided or passed
    // to this component. We have the searchTerm and we have the
    // onChange function. The searchTerm stores the user input into the search bar,
    // the onChange updates state of App.js when user input changes. 
    const searchTermFromProps = this.props.searchTerm;
    const onChangeFromProps = this.props.onChange;

    return (
      <div className="SearchFormForm">
        <form>
          <h4 style={{margin: '0 0 12px 0'}}>Search this list: </h4> 
          <input
            type="search"
            value={searchTermFromProps}
            onChange={onChangeFromProps}
            placeholder="Search"
          />
        </form>
      </div>
    );
  }
} // close the SearchForm Component

export default SearchForm;