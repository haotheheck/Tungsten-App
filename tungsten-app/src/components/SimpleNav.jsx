import React from 'react';
import { Link } from 'react-router-dom';
import useLoginStatus from '../hooks/useLoginStatus';
import {logout} from '../services/authService';
import { likeNav, searchNav, pantryNav, loginIcon, qMark } from '../util/imgPicker';
import '../index.css';

// A simple nav system for routing menu buttons to react router

export default function NavBar(props){

    const setLoggingout = () => { 
        logout(); // deletes jwt token from storage
        props.setOnlineStatus(false);   //calls parent logout in app.js etc..
    }
    const LoginStatus = useLoginStatus; // retrives user name
    const logged = props.onLineStatus; // current login status from app.js for conditional rendering. perhaps use a context

    // implemented conditional place holders for quick styling 
    return ( 
            <div className="menu-outer">
                    <ul id="horizontal-list">
                        {logged && <li><LoginStatus className="user-status" isAuthed={logged}></LoginStatus></li>}
                        {!logged && <li><button className="user-status"> <Link to="/login" className="nav-text">{loginIcon()}<br />Login</Link></button></li>}
                        {logged && <li className={logged? "show" : "inactive"}><button className="nav-icon"><Link to="/pantry" className="nav-text">{pantryNav(logged)}<br />Pantry</Link></button></li>}
                        <li><button className="nav-icon"><Link to="/search" className="nav-text">{searchNav()}<br />Search</Link></button></li>
                        {logged && <li><button className="nav-icon"><Link to="/fav" className="nav-text">{likeNav()}<br />Fav</Link></button></li>}
                        <li><button className="nav-icon"><Link to="/about" className="nav-text">{qMark()}<br />About</Link></button></li>
                        {logged && <li className={logged? "show" : "hide"}><button className={"logout"} onClick={() => logged? setLoggingout() : null}><p>Logout</p></button></li>}
                    </ul>
            </div> 
            );
}
 