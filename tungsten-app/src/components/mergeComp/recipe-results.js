import React, { Component } from "react";
import apiFetch from '../../services/apiService';
import { drinks } from "./staticJSONsearchResults";
import { loadRecipes, backButton, ingredientButtons, ingCheckButtons } from '../../util/imgPicker';
import TungstenLogo_s from '../../img/TungstenLogo_s.png';

class RecipeResults extends Component {
  constructor(props){
    super(props);
    this.state = {
      isFetched: false,// To check if API mounted successfully
      errorMsg: "", // To store error mounting API
      recipeListApiData: drinks, // This is default / dummy API data (see import above). It should get replaced below. // has been removed
      status: "idle",
      loaded:false,
    };
    this.image = React.createRef();
  }

  handleImageLoaded = () => { // changes img source from placeholder once image has loaded
    if(!this.state.loaded){
      this.setState({ loaded: true});
    }
  }


  async componentDidMount(){
     const img = this.image.current;
    //if (this.props.resultsURL.length > 1) {
      //console.log("API key is present...");
      try {
        this.setState({status: "requesting"});
        const testItem = {drinks:"None Found"};
        const API_URL = this.props.resultsURL;
        //console.log(API_URL);
        
        // const jsonResult = await response.json();
        const jsonResult = await apiFetch(API_URL); // fetching data from server
        //console.log("jsonResult received:");
        this.setState({status: "received"});
        //console.log(jsonResult);
        if(jsonResult.drinks === testItem.drinks){ //used in the dev stage
          //console.log("Test case hit - blank results page");
          this.setState({ recipeListApiData: [] });
          // Otherwise it will fill it with data in the wrong format.
          // This way it is easy to identify empty results. 
        if(img && img.complete){ // 
          this.handleImageLoaded(); // changes the load state which will render the cocktail image 
        }
        
        }
        else this.setState({ recipeListApiData: jsonResult.drinks });
        //console.log("Mount attempt successful. Data Loaded:");
        //console.log(this.state.recipeListApiData);
        this.setState({ isFetched: true });
      } catch (error) {
        //console.log(error);
        this.setState({ isFetched: false });
        this.setState({ errorMsg: error });
      }
    // } else {
    //   console.log("API key not present...");
    //   console.log("Mount attempt successful. Data Loaded:");
    //   console.log(this.state.recipeListApiData);
    // }
  }

  render(){
    const returnToSearch = this.props.returnToSearch; // This is a function from App.js to change the active component back to the previous page (search page)
    const recipeList = this.state.recipeListApiData;  // This is a reference to the JSON data, above
    const filters = this.props.filters;  // this is the list of the search filters which was used to generate these results (cocktails)
    const makeInstructionsURL = this.props.makeInstructionsURL; // this function is in App.js and it makes a simple URL to get the JSON data for the recipe of whichever coctkail is chosen

    const { userPantry, isAuthed } = this.props
    const { status, loaded } = this.state;
    

    
    return(
      
      <div class="recResultsAll">
        {backButton(returnToSearch)}
        <div>
          <h4>Active Ingredients:</h4><br />
            {filters.sort(this.compareAbc).map((i,index) => {
                if (isAuthed && userPantry.some(e => e.strIngredient1 === i.strIngredient1)) // Checking ingredients against ingredients in pantry
                return ingCheckButtons(i.strIngredient1,i.strIngredient1+index,function(){}); //add in pantry icon
                return ingredientButtons(i.strIngredient1,i.strIngredient1+index,function(){}); // default icon
            })}
          </div>
        <h1>Cocktail Recipes</h1>
        <p>Number of cocktails found: {recipeList.length}</p>
          
          {status === 'requesting' ? loadRecipes() : status !== 'idle' ? <></> :  <></>} {/* display loading gif while api data is being req*/ }
            {/* display recipes once api has been sucessfully loaded */ }
          {status === 'received' &&  recipeList.map((a,index) => ( 
            <button
              onClick={() => makeInstructionsURL(a.idDrink)} // display loading gif while api data is being req // 
              key={index+"-recl"}
              className="cocktails"
            >
              <img src={loaded? a.strDrinkThumb : TungstenLogo_s} key={a.idDrink+index} alt='tungsten' ref={this.image} onLoad={this.handleImageLoaded} /><br /> {/* display cocktail image */ }
              <span className="IngredientsList">{a.strDrink}</span> {/* display cocktail name */ }
            </button>
          ))}

      </div>
    );
  }
}

export default RecipeResults;
