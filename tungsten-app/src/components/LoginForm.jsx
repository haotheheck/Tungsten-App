import React, {useState, useEffect} from 'react';
import { login } from '../services/authService';
import { createAccount } from '../services/userService';
import useFormInput from '../hooks/useFormInput';
import { loadIngredientUrl } from '../util/imgPicker';
import { useLocation, Link } from 'react-router-dom';
import '../style/style.css';

// responsible for logging in or creating a user account and then navigating the user to the page that they came from. 

export default function Loginform(props) {
    

    const name = useFormInput(""); // handles form input on change etc..
    const email = useFormInput(""); 
    const password = useFormInput("");

    const submit = () => setStatus('logging'); // form submit button funtion call
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');

    const location = useLocation().pathname;
    const signupPage = '/signup';
    const loginPage = '/login';
    
    useEffect(() => {
        if (status === 'idle' || status ==='error')
        return;
        let isMounted = true;
        
        async function update(){
            try{ //email: "sally@gmail.com", password: "tungsten"
                setStatus('logging'); //update display for display render loading image
                
                switch (location){
                    case signupPage:
                        await createAccount({name: name.value,email: email.value, password: password.value, pantry: [] }); //new userJson with only mandatory values
                        await login({email: email.value, password: password.value}); // Added Quick auto login implementaion // 
                        if (isMounted){
                            props.history.replace('/');
                            props.history.go(-1);
                            //console.log('created');
                        }
                        break;

                    case loginPage:
                        const result = await login({email: email.value, password: password.value}); // auth user details as json object
                        if (result && isMounted){ // Will do for now
                        }
                        break;
                        default: break;
                    }
                    
                    props.history.replace('/'); // https://reactrouter.com/web/api/history // remove login page from history 
                    props.history.go(-1); // return to the page they where viewing before logging in
                    setStatus('complete');
                    //console.log('logged');
                    props.isAuthed(true);

                }
              catch(err){
                
                if (err.response && err.response.status ===400){
                  setStatus('error'); // Need To Implement
                  setError(err.response.data);
                  //console.log(err.response.data); // use this result to display reason : ie password too short etc // Should do client side validation
                  return err.response.data; 
                }
                setStatus('error');
                //console.log(err) // Internal Server Error // display friendly error
                return err 
                
              }
        }
        update();

        return () => {
            setStatus('idle');
            isMounted = false;
        };

        
      },[status, email.value, password.value, props,location, name.value]); // dependencys
      
      // standard form nothing new here.
     
      return (
          
          <div className="boxme">
          {/* conditionally render header */}
            {location === loginPage ? <h1 style={{textAlign:'center'}}>Login</h1> : location === signupPage? <h1 style={{textAlign:'center'}}>Create Account</h1> : <p></p>} 
                <div>
                    {loggingImages(status)} {/* {function below} */}

                     {location === signupPage &&
                    <div style={{textAlign:'center', margin:'16px 0 0 0'}}>
                        <input {...name} type="text" className="form-control" id="InputName" aria-describedby="nameHelp" placeholder="Name"></input>
                        <small id="nameHelp" className="form-text text-muted" role="alert"></small>
                    </div>}

                    <div style={{textAlign:'center', margin:'16px 0 0 0'}}>
                       
                        <input {...email} type="text" className="form-control" id="InputEmail" aria-describedby="emailHelp" placeholder="Email"></input>
                        <small id="emailHelp" className="form-text text-muted"></small>
                    </div>


                    <div style={{textAlign:'center', margin:'16px 0 0 0'}}>
                      
                        <input {...password} type="password" className="form-control" id="InputPassword" placeholder="Password"></input>
                        <small id="passwordHelp" className="form-text text-muted"></small>
                    </div>

                    <div style={{textAlign:'center', margin:'16px 0 0 0'}}>
                        <small id="help" className="form-text text-muted">{error}</small>
                    </div>


                    <div>
                        <button onClick={() => submit()} type="submit" className="signIn" >Sign in</button>
                    </div> 
                        <div>
                        {location === loginPage ? <Link to="/signup" class="create-link">Create Account</Link> : location === signupPage ? <Link to="/login">previous</Link> : <p></p>}
                    </div>


            </div>
            
        </div>
    );

    
}

const loggingImages = (status) => { // function that retruns the log in image conditionally based on login status
    return <img src={status === 'idle'? "//ssl.gstatic.com/accounts/ui/avatar_2x.png" : loadIngredientUrl} alt="profile-img" className="profile-img-card"
    />
}

