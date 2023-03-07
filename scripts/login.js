// variables to store the api-keys received trakt.tv, stored in config.js
// var clientId = "";
var clientSecret = "";
var token = "";
var username = traktapi.username;
var token2 = traktapi.token2
var redirectUri = "http://127.0.0.1:5500/movie-webapp/";

/** access apikeys stored in config2.js and assign to variables */
// function getCredentials() {
//   clientId = traktapi.clientId
//   clientSecret = traktapi.clientSecret
// }

/** force login */
function login() {
  console.log(clientId)
  url = `https://api.trakt.tv/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=http%3A%2F%2F127.0.0.1%3A5500%2Fmovie-webapp%2F`
  window.location.href = url
}

/** get the code that is in the url */
function getCode() {
  const code = new URLSearchParams(window.location.search).get("code")

  if (code === null) {
    console.log("There is no code yet");
  } else {
    console.log("Received a code");
    
    // call function that replaces the code received now with a token valid for 3 months
    getToken(code);
  }
}

// window.addEventListener('load', getCredentials)
// window.addEventListener('load', getCode)

/** replace code with token */
function getToken(code) {
  var request = new XMLHttpRequest();

  request.open('POST', 'https://api.trakt.tv/oauth/token');

  request.setRequestHeader('Content-Type', 'application/json');

  request.onreadystatechange = function () {
  if (this.readyState === 4) {
    console.log('Status:', this.status);
    console.log('Headers:', this.getAllResponseHeaders());
    console.log('Body:', this.responseText);
    var response = JSON.parse(this.responseText);
    token = response["access_token"];

    traktapi.token = token;
    console.log(traktapi.token)
  }
};

    var body = {
    'code': code,
    'client_id': clientId,
    'client_secret': clientSecret,
    'redirect_uri': redirectUri,
    'grant_type': 'authorization_code'
};

request.send(JSON.stringify(body));
}


