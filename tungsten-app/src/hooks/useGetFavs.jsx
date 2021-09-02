import { useEffect, useState } from 'react';
import { getUserObject } from '../services/authService';
import { getUser } from '../services/userService';
import { getCancelToken } from '../services/httpService';
import  apiFetch  from '../services/apiService';

// Quick Implementation responsible for getting the favs from users in database. // basically the same as useGetPantry

export default function useGetFavs(){

    const [status, setStatus] = useState('init');
    const [favs, setFavs] = useState();

    useEffect(() => {
        let isMounted = true;
        const source = getCancelToken(); // we need to cancel the request if user the component unmounts. 
        
            async function requestUserFavs(){
                try {
                    
                    setStatus('requesting');
                    let currentUser = getUserObject();
                    if(!isMounted || !currentUser || typeof currentUser === 'undefined') return setStatus('invalid token');

                    currentUser = await getUser(currentUser, { cancelToken: source.token}); // Authenticating User + refreshing Pantry
                    //console.log(currentUser.data)
                    const favs = await Promise.all(
                        currentUser.data.favs.map(id => getFavs(id)) // calls function on each item to return data from cocktail database
                    ).catch(

                    );
                    if(isMounted){
                        const cocktails = favs.filter(i => checkItem(i));
                        //console.log(cocktails);
                        setFavs(cocktails);
                        setStatus('received');
                    }
                }
                catch(ex){
                    return ex;
                }
            }
            
            requestUserFavs();
        
        return () => {
            isMounted = false;
            source.cancel("canceled");
        };

    },[]);

    return {
        status,
        favs
    }
}

async function getFavs(id){ // req cocktail db

    try{
        //console.log(id);
        const res = await apiFetch(`/lookup.php?i=${id}`);
        //console.log(res);
        return res.drinks[0];

    }
    catch(err){
        //console.log(err);
    }
}

function checkItem(i) {
    return i !== undefined; //checking items just in case there are blanks
}


