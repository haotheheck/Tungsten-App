import http from './httpService';
import {apiUrl} from '../config.json';

// handles users api endpoint req

const apiUserEndpoint = `${apiUrl}/api/users/`;


export function createAccount(user) { // req create account

    return http.post(`${apiUserEndpoint}signup`,user);
};

export function getUser(user) { // req user

    return http.get(`${apiUserEndpoint}me`,user)
};

export function remove(user) { // todo

    return http.delete(`${apiUserEndpoint}${user}`);
};

export function updateUserPantry(user,pantry) { // pretty obvious what this does :)
    
    return http.put(`${apiUserEndpoint}pantry/:${user._id}`, {'pantry': pantry});
};

export function updateUserFavs(user,favs) { 
    
    return http.put(`${apiUserEndpoint}favs/:${user._id}`, {'favs': favs});
};

export function ping(){ // sends call to the server to load it if free hosting service unloaded due to inactivity. called upon app init. 
    return http.get(apiUrl);
}
