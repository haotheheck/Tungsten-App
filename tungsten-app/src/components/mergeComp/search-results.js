import React, { Component } from "react";
import {ingredientButtons} from '../../util/imgPicker';
import '../../style/style.css';

class SearchResults extends Component {
  ingredientFilterFunction(searchTerm) {
    return function(ingredObj) {
      let ingredName = ingredObj.strIngredient1.toLowerCase();
      return ingredName.includes(searchTerm.toLowerCase());
    };
  }
  // This was the first button handler in my code. Hence the basic name. It exists in App.js, and triggers a couple of other functions. Those functions add the chosen filter to the state filters list, and remove it from the cocktailIngredList
  render() {
    const buttonHandler = this.props.buttonHandler;
    const searchTermFromProps = this.props.searchTerm;// described above
    const cocktailIngredList = this.props.cocktailIngredList;// the list of possible ingredients
    const compareAbc = this.props.compareAbc; // this is a function in App.js which alphabetically sorts the results.
    const ingredientFilterFunction = this.ingredientFilterFunction;
    
    // let's calculate how many elements or obejcts are
    // in the array after the filter is applied.
    let numberResults = cocktailIngredList.filter(
      ingredientFilterFunction(searchTermFromProps)
    ).length;
     
    return (
      <div>
        <p>Number of ingredients found: {numberResults}<br /></p>

          <div className="ingredient-list">
          {cocktailIngredList.filter(ingredientFilterFunction(searchTermFromProps)).sort(compareAbc).map(i => 
          ingredientButtons(i.strIngredient1, i.strIngredient1, buttonHandler))}
          </div>

        {/* {cocktailIngredList
          .filter(this.ingredientFilterFunction(searchTermFromProps)).sort(compareAbc).map(a => (
            <button
              onClick={() => buttonHandler(a.strIngredient1)}
              key={a.strIngredient1 + "srch"}
              className="orange"
            >
              <b>{a.strIngredient1}</b>
            </button>
          ))} */}
      </div>
    );
  }
} // close the SearchResults component

export default SearchResults;

