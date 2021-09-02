import { useEffect, useState } from 'react';
import { getUserObject } from '../services/authService';
import { updateUserPantry } from '../services/userService';
import { getCancelToken } from '../services/httpService';

// Hook for retrieving user details from jwt token and updating users pantry// not used at the moment
export default function useUpdateUser(){

    const [user, setUser] = useState();
    
    
    useEffect(() => {
        
        const source = getCancelToken();
        let isMounted = true;
        
        async function updateUser(){
            try{
                let currentUser = getUserObject();
                if(!isMounted || !currentUser || typeof currentUser === 'undefined') return setUser(null);
                currentUser = await updateUserPantry(currentUser, { cancelToken: source.token });
                console.log(currentUser);
            }
            catch(err){
                setUser(null);
            }

        }
        updateUser();
        
        return () => {
            isMounted = false;
            source.cancel("canceled"); //cancel request on unmount
        };

    },);

    return {
        user
    }

}