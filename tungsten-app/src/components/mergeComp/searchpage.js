// import React, { Component } from "react";

// import "./style/style.css";


// class searchpage extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       searchTerm: "",
//       len: 0,
//       filters: [],
//       apiData: [],
//       isFetched: false,
//       errorMsg: null
//     };
//     this.onSearchFormChange = this.onSearchFormChange.bind(this);
//     this.handleFilterSelection = this.handleFilterSelection.bind(this);
//     this.compareAbc = this.compareAbc.bind(this);
//   } // end constructor
//   /** This is the method called when the search form box changes **/
//   /** Javascript will create an event object for you **/
//   onSearchFormChange(event) {
//     // We re-assign the state variable called searchTerm
//     // event is understood by Javascript to be a change to a UI item
//     this.setState({ searchTerm: event.target.value });
//     let sTerm = event.target.value; // typed in value
//     let numChars = sTerm.length;
//     this.setState({ len: numChars });
//   }

//   async componentDidMount() {
//     try {
//       const API_URL =
//         "https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list";
//       // Fetch or access the service at the API_URL address
//       const response = await fetch(API_URL);
//       // wait for the response. When it arrives, store the JSON version
//       // of the response in this variable.
//       const jsonResult = await response.json();

//       // update the state variables correctly.
//       this.setState({ apiData: jsonResult.drinks });
//       this.setState({ isFetched: true });
//     } catch (error) {
//       // In the case of an error ...
//       this.setState({ isFetched: false });
//       // This will be used to display error message.
//       this.setState({ errorMsg: error });
//     } // end of try catch
//   } // end of componentDidMount()
//   handleFilterSelection(filterId) {
//     let foundFilter = this.state.apiData.filter(
//       this.findFilterObject(filterId)
//     );
//     this.setState({
//       filters: this.state.filters.concat(foundFilter)
//     });
//     this.removeSearchIngredient(filterId);
//   }
//   findFilterObject(filterId) {
//     return function(filterObj) {
//       return filterObj.strIngredient1 === filterId;
//     };
//   }
//   removeFilter(filterId) {
//     let filterItems = this.state.filters.filter(
//       item => item.strIngredient1 !== filterId
//     );
//     this.setState({ filters: filterItems });
//     this.replaceSearchIngredients(filterId);
//   }

//   removeSearchIngredient(filterId) {
//     let filterItems = this.state.apiData.filter(
//       item => item.strIngredient1 !== filterId
//     );
//     this.setState({ apiData: filterItems });
//   }

//   replaceSearchIngredients(filterId) {
//     let foundFilter = this.state.filters.filter(
//       this.findFilterObject(filterId)
//     );
//     this.setState({
//       apiData: this.state.apiData.concat(foundFilter)
//     });
//   }

//   checkActiveFilters(filterId) {
//     let foundFilter = this.state.apiData.filter(
//       this.findFilterObject(filterId)
//     );
//     return this.state.filters.some(foundFilter.strIngredient1);
//   }

//   compareAbc(ingr1, ingr2){
//     let comparison = 0;
//     let ingr1Str = ingr1.strIngredient1.toLowerCase();
//     let ingr2Str = ingr2.strIngredient1.toLowerCase();
//     if(ingr1Str > ingr2Str) comparison=1;
//     else if(ingr2Str > ingr1Str) comparison=-1;
//     return comparison;
//   }

//   clearActiveFilters() {
//     this.setState({ filters: [] });
//   }

//   render() {
//     return (
//       <div>
//         <h1>Search Cocktails By Ingredient</h1>
//         <p>Click on an ingredient from the Ingredients List, to add it to your search filters. Then, click GO to search for cocktails which contain those ingredients!</p>
//         {
//           //this.state.filters.length > 0 &&
//           <div>
//             <h3>Active Filters</h3>
          
//             {this.state.filters.sort(this.compareAbc).map(a => (
//               <button
//                 onClick={() => this.removeFilter(a.strIngredient1)}
//                 key={a.strIngredient1 + "filt"}
//                 className="orange"
//               >
//                 <b>{a.strIngredient1}</b>
//               </button>
//             ))}

//             <p>When you're ready, click GO to search for cocktail recipes with these ingredients, or, click on your active filters to remove them one-by-one. Click clear to remove them all, and start again.</p>
//             <button className="go">GO</button>
//             <button
//              button
//                 onClick={() => this.clearActiveFilters()}
//               className="goclear" 
//             >
//             Clear</button>
//           </div>
//         }
//         <h3>Ingredients List</h3>
//         <SearchForm
//           searchTerm={this.state.searchTerm}
//           onChange={this.onSearchFormChange}
//         />
//         <SearchResults
//           searchTerm={this.state.searchTerm}
//           globalArray={this.state.globalArray}
//           buttonHandler={this.handleFilterSelection}
//           cocktailIngredList={this.state.apiData}
//           checkActiveFilters={this.checkActiveFilters}
//           compareAbc={this.compareAbc}
//         />
//       </div>
//     ); // end of return statement
//   } // end of render function
// } // end of class

// /** We use this component to display or render the results of search**/
// class SearchResults extends Component {

//   ingredientFilterFunction(searchTerm) {
//     return function(ingredObj) {
//       let ingredName = ingredObj.strIngredient1.toLowerCase();
//       return ingredName.includes(searchTerm.toLowerCase());
//     };
//   }

//   render() {
//     const buttonHandler = this.props.buttonHandler;
//     const searchTermFromProps = this.props.searchTerm;
//     const cocktailIngredList = this.props.cocktailIngredList;
//     const compareAbc = this.props.compareAbc;
//     // const checkActiveFilters = this.props.checkActiveFilters;

//     // let's calculate how many elements or obejcts are
//     // in the array after the filter is applied.
//     let numberResults = cocktailIngredList.filter(
//       this.ingredientFilterFunction(searchTermFromProps)
//     ).length;

//     return (
//       <div className="SearchResultsDisplay">
//         <p>Number of ingredients found {numberResults}<br /></p>
        
//         {cocktailIngredList
//           .filter(this.ingredientFilterFunction(searchTermFromProps)).sort(compareAbc).map(a => (
//             <button
//               onClick={() => buttonHandler(a.strIngredient1)}
//               key={a.strIngredient1 + "srch"}
//               className="orange"
//             >
//               <b>{a.strIngredient1}</b>
//             </button>
//           ))}
//       </div>
//     );
//   }
// } // close the SearchResults component

// // class recipeResults extends Component {

// //   recipeFilterFunction(this.state.filters){
// //     return function(recipeOnj) {
// //       let recipeName = recipeObj.
// //     }
// //   }
// //   render(){
// //   }
// // }

// class SearchForm extends Component {
//   render() {
//     // this.props are the properties which are provided or passed
//     // to this component. We have the searchTerm and we have the
//     // onChange function.
//     const searchTermFromProps = this.props.searchTerm;
//     const onChangeFromProps = this.props.onChange;

//     return (
//       <div className="SearchFormForm">
//         <form>
//           <h4>Search this list: </h4> 
//           <input
//             type="text"
//             value={searchTermFromProps}
//             onChange={onChangeFromProps}
//           />
//         </form>
//       </div>
//     );
//   }
// } // close the SearchForm Component

// export default searchpage;
