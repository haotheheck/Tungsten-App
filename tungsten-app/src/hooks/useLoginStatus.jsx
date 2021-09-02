import { useEffect, useState } from 'react';
import { getUserObject } from '../services/authService';
import { getUser } from '../services/userService';
import { getCancelToken } from '../services/httpService';

// responsible for returning the users name as jsx 

export default function useLoginStatus(isAuthed){

    const [status, setStatus] = useState(isAuthed.status);
    const [name, setName] = useState('');

    useEffect(() => {
        
        let isMounted = true;
        const source = getCancelToken();
        
            async function returnUser(){
                try{
                    let currentUser = getUserObject(); // from token
                    if(!isMounted || !currentUser || typeof currentUser === 'undefined') return setStatus(false); // if token has error
                    currentUser = await getUser(currentUser, { cancelToken: source.token }); // auth user from server
                    setStatus(true); // need to test this further for invalid tokens etc.
                    setName(currentUser.data.name);
                    
                }
                catch(err){
                    setStatus(false);
                    setName('');
                }

            }

        returnUser();
        isMounted = false;
        
        return () => {
            isMounted = false;
            source.cancel("canceled"); // cancel http request
        };

    },);
    // returns jsx element // will do for now
    return (
        status ? <strong>{ " "+ name }</strong> : <strong>logged_out</strong>
    )

}

