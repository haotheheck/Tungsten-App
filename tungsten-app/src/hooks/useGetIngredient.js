import { useEffect, useState } from 'react';
//import { getCancelToken } from '../services/httpService';
import  apiFetch  from '../services/apiService';

// Responsible for retrieving ingredient from cocktail db via name --> Note Need to implement cancelToken


export default function useGetIngredient(input){

    const [status, setStatus] = useState('init');
    const [ingredient, setIngredient] = useState();
    
    useEffect(() => {
        if (input ==='***') return setStatus('init'); //Cocktail returns gin by default blank search.

        let isMounted = true;
        //const source = getCancelToken();
        
            async function requestIngredients(){
                try {
                    setStatus('requesting');
                    let ingredient = await getIngredient(input);
                  
                    if(isMounted){ // will use refs in future
                        console.log(ingredient);  
                        setIngredient(ingredient);                      
                        setStatus('received');
                    }
                }
                catch(err){
                    setStatus('error')
                }
            }
            requestIngredients();

        return () => {
            isMounted = false;
            //source.cancel("canceled");
        };

    },[input]);// dependacy on input; will trigger effect 

    return {
        status,
        ingredient
    }
}

async function getIngredient(input){

    try{
        //throw new Error('Oops'); 
        const res = await apiFetch(`/search.php?i=${input}`); // calls to server to process using apiFetch
        //console.log(res)
        return res.ingredients !== null ? res.ingredients[0] : null; //return ingredient data from Json array retrieved from cocktaildatabase
     
    }
    catch(err){
       throw new Error(err); // Note store error message in log 
    }
}

