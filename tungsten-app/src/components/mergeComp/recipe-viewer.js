import React, { Component } from "react";
import apiFetch from '../../services/apiService';
import {ingredientButtons, backButton, ingCheckButtons} from '../../util/imgPicker';
import TungstenLogo_s from '../../img/TungstenLogo_s.png';

// NB: the state item drinks, inside recipeInstructionsApiData, hsa been filled with blank data in a format that matches the actual JSON data we hope to render.
    // this dummy data helps to correctly render the real JSON results, even if their is a delay before the JSON data can be read and the component needs to re-render with the new data.

class RecipeViewer extends Component {
  constructor(props){
    super(props);
    this.state = {
      isFetched: false,
      loaded:false,
      recipeInstructionsApiData: {
        drinks: [{
            strDrink: "",
            strGlass: "",
            strIngredient1: "",
            strIngredient2: "",
            strIngredient3: "",
            strIngredient4: "",
            strIngredient5: "",
            strIngredient6: "",
            strIngredient7: "",
            strIngredient8: "",
            strInstructions: "",
          }]
      },
      errorMsg:"",
      status: "idle",
    };
    this.image = React.createRef();
  }
  async componentDidMount(){
    try {
      this.setState({status: "requesting"});

      const API_URL = this.props.recipeURL;
      const jsonResult = await apiFetch(API_URL);
      

      this.setState({status: "received"});
      //console.log(this.state.status);
      // console.log("jsonResult received:");
      // console.log(jsonResult);
      this.setState({ recipeInstructionsApiData: jsonResult });
      this.setState({ isFetched: true });
      // console.log("Mount attempt successful. Data Loaded:");
      // console.log(this.state.recipeInstructionsApiData);
    } catch (error) {
      this.setState({ isFetched: false });
      //console.log("mount attempt failed");
      this.setState({ errorMsg: error });
      //console.log(this.state.errorMsg);
    }
  }

  handleImageLoaded = () => { // changes img source from placeholder once image has loaded
    if(!this.state.loaded){
      this.setState({ loaded: true});
    }
  }
 

  render(){

    //console.log("API fetched yet? = "+this.state.isFetched);
    const drink = this.state.recipeInstructionsApiData.drinks[0];// This is the way the JSON data is stored for the recipes. It's only one recipe, but it returns as an array of recipes.
    const { isAuthed, userPantry, returnFromRecipe } = this.props; // returnFromRecipe references a function in App.js which changes the active component back to the cocktails listed according to the chosen ingredients.
    const { status, loaded } = this.state;


    const ingredientNames = []; // getting ingredient values from drink props for rendering images // small amount of data to process // 
    if (status === 'received'){
        for (const prop in drink){
          if (drink && prop.match(/^strIngredient/) && drink[prop] !== ''  && drink[prop] !== null && !ingredientNames.some(i => i === drink[prop])){ //checking prop is stringredient
            const measurement = drink[`strMeasure${prop.slice(-1)}`]; //getting corresponding measurement using number values at end of prop name
            measurement != null ? ingredientNames.push({name : drink[prop], measure : measurement}) : ingredientNames.push({name : drink[prop]});  // pushing info as object  
          }
        }
        //console.log(ingredientNames);
    }
    
    return(
      <div className="RecipeViewer">
      {backButton(returnFromRecipe)}    
      {(status === 'idle' || status === 'requesting')  && <div></div>}   
      {status === 'received' && <React.Fragment> {/* display details once api has been sucessfully loaded */ } 
          <div className="recipeImage" >
            <h1>Recipe: {drink.strDrink}</h1><br />
            <img src= {loaded? drink.strDrinkThumb : TungstenLogo_s} alt="tungsten" style={imgStyle} ref={this.image} onLoad={this.handleImageLoaded}/>
          </div>
            <h3>Ingredients:</h3><br />
            {ingredientNames.sort(this.compareAbc).map((i,index) => {// Checking ingredients against ingredients in pantry
                if (isAuthed && userPantry && userPantry.some(e => e.strIngredient.toLowerCase() === i.name.toLowerCase())) // cocktail api has some issues with consistency in naming 
                return ingCheckButtons(i.name,i.name+index,function(){},i.measure); //displays pantry icon beside ing that user has
                return ingredientButtons(i.name,i.name+index,function(){},i.measure);//displays reg ing
            })}
            </React.Fragment>
            }

             { status === 'received' && drink.strGlass !== null && // renders glass details 
              <div>
                <h3>Type of glass:</h3><p>
                    { drink.strGlass }
                    { !drink.strGlass && 'any' }
                    </p>
            <h3>Instructions:</h3>
                { styleInstruction(drink.strInstructions) }
              </div>
          }   
      </div>
    );
    
  }
}

export default RecipeViewer;


function styleInstruction(instructions){ // mapping instructions to single lines. //cause errors react key errors etc atm <p> elements stacked // will fix

  const lines = instructions.split('.');
  return(<p style={{lineHeight: '150%', whitSpace: 'pre-wrap'}}>{lines.map((i,index )=> (
    <p key={index}>{i}</p>
 ))}</p>
    
  )
}


const imgStyle = {
  display:'block',
  marginLeft: 'auto',
  marginRight: 'auto',
  borderRadius: '30px'
}




