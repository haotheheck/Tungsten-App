import React, {useState, useEffect } from "react";
import { Route } from 'react-router-dom';
import Pantry from './components/Pantry';
import Fav from './components/Fav';
import SearchCocktail from './components/mergeComp/SearchCocktail';
import LoginForm from './components/LoginForm';
import { getToken } from './services/authService';
import NavBar from "./components/SimpleNav";
import { ping } from './services/userService';
import TungstenLogo from './img/TungstenLogo-Final-01.png';
import TungstenText from './img/TungstenText-01.png';

// responsible for rendering navbar, controlling online status and rendering the routes conditionally. 

function App (){

  
  const [onLineStatus, setOnlineStatus] = useState(false);


  useEffect(() => { // -- QUICK IMPLEMENTATION -- we should check token in server although any auth protected routes will reject invalid/modified tokens. 
    if (getToken()) 
    setOnlineStatus(true);

  },[onLineStatus]);
  // routing for paths to render components conditionally

    return (
      <div className="body" >

          
          <div className="logoDivTop">
            <img src={TungstenLogo} alt="tungsten logo" />
            <img src={TungstenText} alt="tungsten" className="logoText"/>
          </div>
          <NavBar onLineStatus={onLineStatus} setOnlineStatus={setOnlineStatus}></NavBar>
              <Route path="/about" />
              <Route path="/signup"/>
              <Route path="/somethingelse"/>
              <Route path="/search" render={(props) => (<SearchCocktail {...props} isAuthed={onLineStatus} setDisplay={"searchPage"} key={Date.now()} />)} />
            { !onLineStatus && <Route path="/login" render={(props) => (<LoginForm {...props} isAuthed={setOnlineStatus} />)} />}
            { !onLineStatus && <Route path="/signup" render={(props) => (<LoginForm {...props} isAuthed={setOnlineStatus} />)} />}
            { onLineStatus &&   <Route path="/pantry" render={(props) => (<Pantry {...props} isAuthed={onLineStatus} />)}/>}
            { onLineStatus &&   <Route path="/fav" render={(props) => (<Fav {...props} isAuthed={onLineStatus} />)}/>}
      </div>
    );
  }


export default App;

// const test = () => {
//   apiFetch("/lookup.php?iid=10");
// }

const pingSer = async() =>{
  await ping(); // loads server if unloaded  at init. A perk of free hosting // will do for now
  //console.log(result);
}
pingSer();
