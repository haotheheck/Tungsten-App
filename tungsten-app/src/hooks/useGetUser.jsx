import { useEffect, useState } from 'react';
import { getUserObject } from '../services/authService';
import { getUser } from '../services/userService';
import { getCancelToken } from '../services/httpService';


export default function useGetUser(){

    const [user, setUser] = useState();
    
    
    useEffect(() => {
        
        const source = getCancelToken();
        let isMounted = true;
        
        async function returnUser(){
            try{
                let currentUser = getUserObject();
                if(!isMounted || !currentUser || typeof currentUser === 'undefined') return setUser(null);
                currentUser = await getUser(currentUser, { cancelToken: source.token });
            }
            catch(err){
                setUser(null);
            }


        }
        returnUser();
        
        return () => {
            isMounted = false;
            source.cancel("canceled");
        };

    },);

    return {
        user
    }

}