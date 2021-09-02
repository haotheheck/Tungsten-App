import http from "./httpService";
import {apiUrl} from "../config.json";
import decode from 'jwt-decode';

const apiEndpoint = apiUrl + "/api/auth"; //end point for making auth protected req

export async function login(details) {
   
    const { data } = await http.post(`${apiEndpoint}/login`, details); //data  will be jwt key returned drom server with encrypted secret;
    localStorage.setItem( "token" , data); // we store this in the browser local storage cache
    return data;
  
}

export function logout() {
    localStorage.removeItem("token");
}


export function getUserObject() {
    try{
        return decode(getToken()); //return user details - atm only name and email is stored in the key
    }
    catch(ex){
        return; // todo
    }
}

export function getToken() {
    try{
        return localStorage.getItem("token");
    }
    catch(ex){

        console.log(ex); // This should never happen
    }
}





