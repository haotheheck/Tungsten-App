import { useEffect, useState } from 'react';
import { getUserObject } from '../services/authService';
import { getUser } from '../services/userService';
import { getCancelToken } from '../services/httpService';
import  apiFetch  from '../services/apiService';

// responsible for getting the pantry from users in database.

export default function useGetPantry(){

    const [status, setStatus] = useState('init');
    const [ingredients, setIngredients] = useState();

    useEffect(() => {
        let isMounted = true;
        const source = getCancelToken(); // we need to cancel the request if user the component unmounts. 
        
            async function requestUserIngredients(){
                try {
                    
                    setStatus('requesting');
                    let currentUser = getUserObject();
                    if(!isMounted || !currentUser || typeof currentUser === 'undefined') return setStatus('invalid token');

                    currentUser = await getUser(currentUser, { cancelToken: source.token}); // Authenticating User + refreshing Pantry
                   
                    const ingredients = await Promise.all(
                        currentUser.data.pantry.map(id => getIngredient(id)) // This will change in future to get a list instead of individual calls // at the moment only way to retrive fll ingredient details for sorting which also needs to implemented
                    ).catch(

                    );
                    if(isMounted){
                        const ingredientsFound = ingredients.filter(i => checkItem(i));
                        setIngredients(ingredientsFound);
                        setStatus('received');
                    }
                }
                catch(ex){
                    return ex;
                }
            }
            
            requestUserIngredients();
        
        return () => {
            isMounted = false;
            source.cancel("canceled");
        };

    },[]);

    return {
        status,
        ingredients
    }
}

async function getIngredient(id){ // req cocktail db

    try{
        //console.log(id);
        const res = await apiFetch(`/lookup.php?iid=${id}`);
        return res.ingredients[0];

    }
    catch(err){
        //console.log(err);
    }
}

function checkItem(i) {
    return i !== undefined; //checking items just in case there are blanks
}


