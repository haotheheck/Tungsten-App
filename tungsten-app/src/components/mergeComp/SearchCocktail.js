/*
NO API KEY!? ...no worries!
NB: In case you missed the description:
This code may not include the required API key to display results. The pvt API key is stored in a file ".env" which IS included in the GitHub.

The code works with/without the API key though, for:
  1) display, search and selection of possible ingredients.
  2) add/removal of search filters (ingredients).
  3) searching cocktail database for cocktails with chosen ingredients (will be dummy results if API key is not present)
  4) Returning a list of cocktails which contain those ingredients. (will be dummy results if API key is not present)
  5) Selecting a cocktail and loading the approprate page from the database, and displaying the instructions/recipe.
*/

import React, { useEffect, useState } from "react";

// The following two components are shown on the first/start page of the search (they could probably do with being merged really):
import SearchResults from "./search-results"; // NB: this search results is list of INGREDIENTS. Recipe search results is below.
import SearchForm from "./search-form";
//
import RecipeResults from "./recipe-results"; // This component displays the results of searching for cocktails with certain ingredients
import RecipeViewer from "./recipe-viewer"; // This component displays a specific cocktail recipe, once chosen
import apiFetch from '../../services/apiService';
//
import '../../style/style.css'; // CSS
import '../../index.css';
import useGetPantry from "../../hooks/useGetPantry";
import imgPicker from '../../util/imgPicker';


const API_KEY = true; // import API key from .env file

export default function SearchCocktail(props) {
 

    const  [searchTerm, setSearchTerm] = useState(""); // stores user input into the searchbar
    const  [len, setLen] = useState(0);  // this stores character length  of the search term. Useful if hiding results until len !=0
    const  [filters,setFilters] = useState([]);  // this stores selected ingredients
    const  [apiData, setApiData] = useState([]);  // this stores the JSON result for THE LIST OF INGREDIENTS. This is a list of 100 ingredients provided by the database admins.
    const  [isFetched, setIsFetched] = useState(false);  // check JSON returned / not returned
    const  [errorMsg,setErrorMsg] = useState(null);  // if fail to mount API, this will store the error message.
    const  [resultsURL, setResultsURL] = useState("");  // this stores the URL to get the search results. It is given its value by a function, makeResultsURL, before mounting the results component.
    const  [recipeURL, setRecipeURL] = useState("");  // this stores the URL to get the specific recipe instructions. A similar function gives it its value: makeInstructionsURL.
    const  [display,setDisplay] = useState(props.setDisplay);  // this determines which component is displayed (values: "searchpage", "recipe-results", "recipe-viewer")

    const  [usePantry, setUsePantry] = useState();
    const  {status, ingredients} = useGetPantry(usePantry);
    
    // Binding functions in order to pass them to components:
    // this.onSearchFormChange = this.onSearchFormChange.bind(this);
    // this.handleFilterSelection = this.handleFilterSelection.bind(this);
    // this.compareAbc = this.compareAbc.bind(this);
    // this.returnToSearch = this.returnToSearch.bind(this);
    // this.makeInstructionsURL = this.makeInstructionsURL.bind(this);
    // this.returnFromRecipe = this.returnFromRecipe.bind(this);
  

  function onSearchFormChange(e) { // this detects user input in the search bar and updates state with the current search info
    setSearchTerm(e.target.value);
    let sTerm = e.target.value;
    let numChars = sTerm.length;
    setLen(numChars);
  }

  // 
  // async componentDidMount() { // this loads the API / JSON data for the start of the search: the list of 100 ingredients
  //   try {
  //     const jsonResult = await apiFetch('/list.php?i=list');
  //     console.log(jsonResult);
  //     this.setState({ apiData: jsonResult.drinks });
  //     this.setState({ isFetched: true });
  //   } catch (error) {
  //     this.setState({ isFetched: false });
  //     this.setState({ errorMsg: error });
  //   }
  // }
    // useEffect(() => {
    //   if (!usePantry) return;

      
    // },[status, ingredients, usePantry])
    
    
    
    useEffect(() => {
        
      let isMounted = true;
      async function requestIngredients(){
        
        if (!usePantry){
                let jsonResult;
                try {
                  jsonResult = await apiFetch('/list.php?i=list');
                  
                    if(isMounted){
                      setApiData(jsonResult.drinks);
                      setIsFetched(true);
                    }
                  } catch (error) {
                    setIsFetched(false);
                    setErrorMsg(error);
                  }
                }
                if (usePantry){
                  if (status === 'received'){
                      const newIngredients = ingredients.map(function(o){ //Quick solution
                        o['strIngredient1'] = o['strIngredient'];
                        return o;
                      })
                    setApiData(newIngredients);
                  }
                }
              }
              requestIngredients();
              
              return () => {
            isMounted = false;
        };

    },[usePantry, ingredients, status]);




  function findFilterObject(filterId) { // this is a utility finder function, to find an object with an identifying parameter of the object: filterId
    return function(filterObj) {
      return filterObj.strIngredient1 === filterId;
    };
  }

  function handleFilterSelection(filterId) { // this manages the user click action to select a filter, and updates state to include filter
    let foundFilter = apiData.filter(
      findFilterObject(filterId)
    );
    setFilters(filters.concat(foundFilter));
    removeSearchIngredient(filterId);
  }

  function removeFilter(filterId) { // this is the opposite of handleFilterSelection, it removes a filter from state / selected filters
    let filterItems = filters.filter(
      item => item.strIngredient1 !== filterId
     
    );
    setFilters(filterItems);
   replaceSearchIngredients(filterId);
  }

  function removeSearchIngredient(filterId) { // this function removes an ingredient from the search results of ingredients, when it is placed into active filters
    let filterItems = apiData.filter(
      item => item.strIngredient1 !== filterId
    );
    setApiData(filterItems);
  }

  function replaceSearchIngredients(filterId) { // this is the opposite of removeSearchIngredient - it replaces an ingredient in search results, when it is removed from filters.
    let foundFilter = filters.filter(
      findFilterObject(filterId)
    );
    setApiData(apiData.concat(foundFilter));
  }

  function compareAbc(ingr1, ingr2){ // this is used to sort the ingredients alphabetically. Helps with display sanity when adding/removing filters.
    let comparison = 0;
    let ingr1Str = ingr1.strIngredient1.toLowerCase();
    let ingr2Str = ingr2.strIngredient1.toLowerCase();
    if(ingr1Str > ingr2Str) comparison=1;
    else if(ingr2Str > ingr1Str) comparison=-1;
    return comparison;
  }

  function clearActiveFilters() { // this wipes all active filters and returns them to the search ingredients list
    let filtersTemp = filters;
    setFilters([])
    setResultsURL("");
  setApiData(apiData.concat(filtersTemp));
  }

  function returnToSearch() { // function to change active component to search page 1
    setDisplay ("searchPage");
  }

  function returnFromRecipe() { // function to change active component to the cocktails which include chosen ingredients
    setDisplay("recipe-results");
  }

  function makeResultsURL() { // function to make URL out of chosen filters, which will then get loaded by recipe-results
    if(API_KEY){ // if API key is included, get real results
      if(filters.length > 0){ // if there are filters to search with, go ahead and make the URL with them.
        //console.log(API_KEY);
        let resultsEARL = `/filter.php?i=`; // base URL format
        // Append base URL with ingredients (replacing spaces with underscores):
        filters.map(a => {
            resultsEARL += a.strIngredient1.replace(" ", "_")+",";
            return true; // it wanted to return a value, so: it returns true. Could be changed to false if feeling moody. Or, maybe a numerical value if feeling smart.
            // maybe a witty retort would be best. 
        })

        resultsEARL = resultsEARL.substring(0, resultsEARL.length-1); // need to chop off the comma from the end of the string now. Easier than watching for the last filters item and treating it differently.
        //console.log("Results URL is:" + resultsEARL);
        setResultsURL(resultsEARL); // update state to carry the URL
        setDisplay("recipe-results");

      } else { // otherwise, file a complaint to console. 
        // NB: This should be forwarded to the DOM. The user should be informed of their transgression, and given a chance to rectify their mistake.
        //console.log("active filters is empty. Please select some ingredients");
      }
    } else { // if API is not included, use dummy results.
      //console.log("API key not present, using fixed results");
      setResultsURL ("");
      setDisplay("recipe-results"); // there is a default JSON file that will be used by recipe-results if resultsURL.length is too short   
    }
  }

  function makeInstructionsURL(idDrink) { // this is a simpler URL making function, since it only adds one value to the URL.
    // The resulting URL will provide the JSON data for the cocktail recipe.
    //console.log("Recipe chosen: "+idDrink);
    if(idDrink){ // this attempts to identify a null value for making the URL ( which may break the API call )
      let recipeEARL = "/lookup.php?i=";
      recipeEARL += idDrink;
      // console.log("Recipe URL to input is: "+recipeEARL+" ...");
      // console.log("State RecipeURL before set is: \""+recipeURL+"\"");

      setRecipeURL(recipeEARL);
      //console.log("State RecipeURL is now: " + recipeURL);
      setDisplay("recipe-viewer");

    }
    else{
      console.log("received drink ID is null"); // please stop trying to break the API call
    }
  }
   // display main App parent component, details here
    // comments inside the return field are finicky.
    /*
      The below is JSX for rendering elements in the browser. Apply CSS to the components as you wish. They are all buttons...
      It would be possible to use an image as a background for the buttons, and select those images in the CSS based on the element id.
      This might be made easier with some additional javascript. Could be cool. Or the image could appear on hover... or turn into colour on hover, instead of no colour. stng like that.
    */ 
    return (
      <div className="searchCocktail">
      <hr />
        {display === "searchPage" &&
          <div className="searchPageMain">
            <h1>Search Cocktails By Ingredient</h1>
            <p>Click on an ingredient from the Ingredients list below, to add it to your search filters. Then, click GO to search for cocktails which contain those ingredients!</p>
            <p>Use the search bar to narrow down the list.</p>
            <div>
              <h3>Selected Ingredients</h3><br />
              {filters.length === 0 && <p className="grey">(Your chosen ingredients will appear here)</p>}

              {filters.sort(compareAbc).map( i => <button key={`${i.strIngredient1}filt`} style={ingStyle}
                onClick={() => removeFilter(i.strIngredient1)}>{imgPicker(i.strIngredient1)}<h4 style={btntxt}>{i.strIngredient1}</h4></button>)}
                
                {/* <button
                  onClick={() => removeFilter(a.strIngredient1)}
                  key={a.strIngredient1 + "filt"}
                  className="orange"
                >
                  <b>{a.strIngredient1}</b>
                </button>
              ))} */}

              <p>
                <br />When you're ready, click GO to search for cocktails using these ingredients. To remove active filters, click on them to remove them one-by-one, or click CLEAR to remove them all.
              </p>
              <div className="ButtonsUseFilters">
              <button className="pantryOption" style={pantryButtonStyle(usePantry)}
                onClick={() => { if(props.isAuthed){setUsePantry(!usePantry); clearActiveFilters();}}}
              >PANTRY
              
              </button>
              <button
                onClick={() => makeResultsURL()}
                className="go"
              >
                GO
              </button>
              <button
                onClick={() => clearActiveFilters()}
                className="goclear" 
              >
                Clear
              </button>
              </div>
            </div>
            <h3>Ingredients List</h3>
            <SearchForm
              searchTerm={searchTerm}
              onChange={onSearchFormChange}
            />
            { !usePantry && <SearchResults style={{minHeight: '200px'}}  // Quick Merge
              searchTerm={searchTerm}
              //globalArray={globalArray}
              buttonHandler={handleFilterSelection}
              cocktailIngredList={apiData}
              compareAbc={compareAbc}
            />}
            { usePantry && status === 'received' && props.isAuthed && <SearchResults // Quick Merge
              searchTerm={searchTerm}
              //globalArray={globalArray}
              buttonHandler={handleFilterSelection}
              cocktailIngredList={apiData}
              compareAbc={compareAbc}
            />}
            { usePantry && !props.isAuthed && 
              <>{(setUsePantry(false), clearActiveFilters())}</>
            }
           
          </div>
        }
        {display === "recipe-results" &&
          <RecipeResults
            isAuthed={props.isAuthed}
            userPantry={ingredients}
            returnToSearch={returnToSearch}
            makeInstructionsURL = {makeInstructionsURL}
            filters = {filters}
            resultsURL = {resultsURL}
          />
        }
        {display === "recipe-viewer" &&
          <RecipeViewer
            isAuthed={props.isAuthed}
            userPantry={ingredients}
            returnFromRecipe={returnFromRecipe}
            recipeURL = {recipeURL}
          />
        }
      </div>
    );
  


}
    
const ingStyle = {
  backgroundColor: 'transparent',
  background: 'transparent',
  margin: "0px",
  borderRadius: '0%',
  border: 'none',
  fontSize: '12px',
  padding: '8px',
  outline:'none'
}


const btntxt = {
  height: "10px",
  margin: "10px, 0",
  fontWeight: 'normal'
}

const pantryButtonStyle = (usePantry) => {

  if (usePantry){ return{ backgroundColor: '#FFD700'}
    }else{ return{ backgroundColor: '#87979A'} }
}