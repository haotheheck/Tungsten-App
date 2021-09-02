
import React, {useState} from 'react';
import '../style/style.css'
import useGetFavs from '../hooks/useGetFavs';
import  {loadRecipes, placeholder, likeIconUrl} from '../util/imgPicker';
// Very Quick Imp -- basically the same as the pantry 

export default function Fav(props){
   
  
    const {status, favs: cocktails } = useGetFavs();
    const [loaded, setLoaded ] = useState();
    const image = React.createRef();
   
    const handleImageLoaded = () => { // changes img source from placeholder once image has loaded
        if(!loaded){
          setLoaded(true);
        }
      }
    
    try{
        if (!props.isAuthed) 
        return  <h1> Please Login </h1>
        
        switch(status){
            
            case 'init':
            return loadRecipes(); // shows loading display

            case 'requesting':
            return loadRecipes();

            case 'received': 
            return renderFavs(cocktails,loaded, placeholder, handleImageLoaded, image); 
       
            case 'invalid token': // Need to test 
            return  <h1> Please Login </h1>

            case 'error': // Tested
            throw new Error();

            default:
            return <><small style={style}>your pantry is empty</small></>

            }
        }catch(err){
                console.log(err);
                return <><h1 style={style}>Oops :(</h1></>
        }

}
        




    // responsibe for rendering favs
    const renderFavs = (cocktails,loaded, placeholder, handleImageLoaded, image) => {
        //console.log(cocktails)
        if (cocktails.length > 0)
        return (<React.Fragment>
            {cocktails.sort((a,b) => sort(a.strDrink,b.strDrink)).map((i,index) => ( <button
              //onClick={() => makeInstructionsURL(a.idDrink)}
              key={index}
              className="cocktails"
            >
              <img src={likeIconUrl} alt="tungsten" style={favCheckButtonStyle}></img>
              <img src={loaded? i.strDrinkThumb : placeholder} key={i.idDrink+index} style={cocktail} alt='tungsten' ref={image} onLoad={handleImageLoaded}></img>
              <span className="IngredientsList">{i.strDrink}</span>
            </button>  
            ))}
        </React.Fragment>);
        else
        return <></> 
}


function sort(a, b){
    if(a > b) return 1
    if(a < b) return -1
    return 0;
}




const cocktail = {
    display:'block',
    marginBottom:'20px',
    marginTop:'40px',
    marginLeft: 'auto',
    marginRight: 'auto',
    // width: '100px',
    width: '100%',
    borderRadius: '30px',
    alt: 'tungsten'
    }



    
const style = {
    textAlign: 'center',
    padding: '48px 0',
}



const favCheckButtonStyle = {
  position: 'relative',
  backgroundColor: 'transparent',
  background: 'transparent',
  width: '16px',
  margin: '0 10% -70% 50px',
  outline:'none'
  
}











      