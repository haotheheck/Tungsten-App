import { apiUrl } from "../config.json"; 

// Wrapper for Fetch to redirect requests to the server -> api key is stored in an environment varible on the server to avoid exposing it to the client side

const apiEndpoint = `${apiUrl}/api/cocktail`;

export default async function apiFetch(url) {
  try {
    const res = await fetch(apiEndpoint, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json"
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify({ url: url })
    });
    return await res.json();
  } catch (ex) {
    return ex; // will return the error message from cocktail tail if any. 
  }
}


