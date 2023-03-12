// variables to store the api-keys received trakt.tv, stored in config.js
// var clientId = "";
var clientSecret = "";
// var token = "";
// var username = traktapi.username;
// var token2 = traktapi.token2
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

/** get the code that is in the url */
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

function createItem(nameOfItem, value) {
	localStorage.setItem(nameOfItem, value); 
} 

function getItem(nameOfItem) {
	return localStorage.getItem(nameOfItem);  
} // Gets the value of 'nameOfItem' and returns it

function test() {
  const url = `https://api.trakt.tv/users/me/watched/movies`;

  let token2 = getItem('token')

  fetch(url, {
      headers: {
          'Content-Type': 'application/json',
          'trakt-api-version': '2',
          'Authorization': `Bearer ${token2}`,
          'trakt-api-key': clientId
      }
  })
  .then(response => {
      console.log('Status:', response.status);
      console.log('Headers:', response.headers);
      return response.json();
  })
  .then(data => {
      console.log(data)
      createItem('watched', data)
              
  })
  .catch(error => console.error('Error:', error));
}

// function getValue() {
// 	return localStorage.getItem('nameOfItem');  
// } // Gets the value of 'nameOfItem' and returns it
// console.log(getValue()); //'value';

// window.addEventListener('load', getCredentials)
// window.addEventListener('load', getCode)

/** replace code with token */
// function getToken(code) {
//   var request = new XMLHttpRequest();

//   request.open('POST', 'https://api.trakt.tv/oauth/token');

//   request.setRequestHeader('Content-Type', 'application/json');

//   request.onreadystatechange = function () {
//   if (this.readyState === 4) {
//     console.log('Status:', this.status);
//     console.log('Headers:', this.getAllResponseHeaders());
//     console.log('Body:', this.responseText);
//     var response = JSON.parse(this.responseText);
//     token = response["access_token"];

//     traktapi.token = token;
//     console.log(traktapi.token)
//   }
// };

//     var body = {
//     'code': code,
//     'client_id': clientId,
//     'client_secret': clientSecret,
//     'redirect_uri': redirectUri,
//     'grant_type': 'authorization_code'
// };

// request.send(JSON.stringify(body));
// }



function addMovieToWatched() {
  // let url = 'https://api.trakt.tv/sync/ratings'

  // // current date in ISO format
  // const now = new Date();
  // const isoString = now.toISOString();

  // fetch(url, {
  // method: 'POST',
  // headers: {
  //     'Content-Type': 'application/json',
  //     'trakt-api-version': '2',
  //     'Authorization': `Bearer ${token2}`,
  //     'trakt-api-key': clientId
  // },
  // body: JSON.stringify({
  //     // 'movies': [
  //     // // {
  //     // //     "watched_at": isoString,
  //     // //     'ids': {
  //     // //         "imdb": "tt0372784"
  //     // //     }
  //     // // }
  //     'movies': [
  //         {
  //           'watched_at': '2014-09-01T09:10:11.000Z',
  //           'title': 'Batman Begins',
  //           'year': 2005,
  //           'ids': {
  //             'trakt': 1,
  //             'slug': 'batman-begins-2005',
  //             'imdb': 'tt0372784',
  //             'tmdb': 272
  //           }
  //         },
  //     ]
  // })
  // })
  // .then(response => {
  //     console.log('Status:', response.status);
  //     console.log('Headers:', response.headers);
  //     return response.text();
  // })
  // .then(data => {
  //     console.log('Body:', data);
  // })
  // .catch(error => {
  //     console.error('Error:', error);
  // });
  var request = new XMLHttpRequest();

  request.open('POST', 'https://api.trakt.tv/sync/history');

  request.setRequestHeader('Content-Type', 'application/json');
  request.setRequestHeader('Authorization', `Bearer ${token2}`);
  request.setRequestHeader('trakt-api-version', '2');
  request.setRequestHeader('trakt-api-key', clientId);
  
  request.onreadystatechange = function () {
    if (this.readyState === 4) {
      console.log('Status:', this.status);
      console.log('Headers:', this.getAllResponseHeaders());
      console.log('Body:', this.responseText);
    }
  };
  
  var body = {
    'movies': [
      {
        'watched_at': '2014-09-01T09:10:11.000Z',
        'title': 'Batman Begins',
        'year': 2005,
        'ids': {
          'trakt': 1,
          'slug': 'batman-begins-2005',
          'imdb': 'tt0372784',
          'tmdb': 272
        }
      },
      {
        'ids': {
          'imdb': 'tt0000111'
        }
      }
    ]

  };
  
  request.send(JSON.stringify(body));
}