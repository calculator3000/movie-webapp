// variables to store the api-keys received trakt.tv, stored in config.js
var clientSecret = "";
var redirectUri = "http://127.0.0.1:5500/movie-webapp/";

/** 
 * force to redirect to the trakt login page. 
 * After the user has logged in, will be redirected to index.html landing page
 * There getCode will be called.
 * */
function login() {
  console.log(clientId)
  url = `https://api.trakt.tv/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`
  window.location.href = url
}

/** 
 * get the code that is in the url 
 * */
function getCode() {
  const code = new URLSearchParams(window.location.search).get("code")

  if (code === null) {
    console.log("There is no code yet");
  } else {
    console.log("Received a code");
    
    // call function that replaces the code received now with a token valid for 3 months
    getToken(code);
    createItem('code', code);
  }
}

/**
 * swap the code with a token
 * @param {*} code 
 */
function getToken(code) {
  const url = 'https://api.trakt.tv/oauth/token';

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'code': code,
      'client_id': clientId,
      'client_secret': clientSecret,
      'redirect_uri': redirectUri,
      'grant_type': 'authorization_code'
    })
  })
  .then(response => {
    console.log('Status:', response.status);
    console.log('Headers:', response.headers);
    return response.json();
  })
  .then(data => {
    let token = data["access_token"];
    console.log(token);
    createItem('token', token)
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

/**
 * set items inside local Storage
 * @param {*} nameOfItem 
 * @param {*} value 
 */
function createItem(nameOfItem, value) {
	localStorage.setItem(nameOfItem, value); 
} 

/**
 * get items from local storage
 * @param {*} nameOfItem 
 * @returns 
 */
function getItem(nameOfItem) {
	return localStorage.getItem(nameOfItem);  
} // Gets the value of 'nameOfItem' and returns it
