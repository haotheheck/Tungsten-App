/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
import { getToken } from './authService';

// wrapper for axios. In future another service can easy easy replace this. 

axios.defaults.headers.common['x-auth-token'] = getToken(); // header required for storing token

axios.interceptors.request.use(req => { // intercept req and add key

  req.headers.common['x-auth-token'] = getToken();
  return req;

}, error =>{
  const expectedError = (error.response && error.response.status >=400 && error.response.status <500);
  if(!expectedError){
    alert('An unexpected error occured'); //go to friendly page
  }
  return Promise.reject(error); 
});


axios.interceptors.response.use(null, error =>{
  const expectedError = (error.response && error.response.status >=400 && error.response.status <500);

  if(!expectedError){
    alert('An unexpected error occured'); //go to friendly page
  }
  return Promise.reject(error);
});

export function getCancelToken(){
  return axios.CancelToken.source(); // for async effect clean up calls

}

export default { // exporting methods

  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete
}