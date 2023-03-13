# 🎥 movie-webapp

In this project we aim to build a website about movies. Users can get information about the top 250 movies, movies that are currently in cinemas, statistics about movies that have been added to the personal watched account on trakt and much more. 

To get the required information, we access several APIs: [Trakt API](https://trakt.docs.apiary.io/), [The Movie Database (TMDB) API](https://developers.themoviedb.org/3), and the [IMDB API](https://imdb-api.com/).

We used the two libraries ChartJS and EmailJS.

## 🧐 Features
The webapp consists of multiple tabs
- **Landing Page**: See a random trailer and 4 random movies currently in theater. Submit feedback through a form (EmailJS).
- **Top 250 Movies**: See, sort, and filter top 250 IMDB movies. View more information about movie in modal.
- **In Theaters**: See movies currently playing in theaters. Filter for genres. Add movie to trakt watchlist.
- **Stats**: See number of movies watched and time spent watching movies (tracked via trakt.tv). See statistics about movies watched per release year, top 6 actors in movies watched, lowest and highest rated movies, genres, production countries and original languages (ChartJS).
- **Watched**: See gallery of movies watched (from trakt.tv).
- **About**: Find data about APIs used.
- **Login**: Login to trakt.tv


## 🎒 Prep Work
1. Create a ```config.js``` file inside ```scripts``` directory
2. Add 3 objects: ```traktapi```, ```moviedb```, and a list ```imdbapi```
3. ```traktapi```: Create a [trakt.tv application](https://trakt.tv/oauth/applications/new) and copy the API token and client secret.
4. Register for an API key with ```moviedb``` and ```imdbapi```.

```javascript
var traktapi = {
    username: "me",
    clientId: [clientIdFromTrakt],
    clientSecret : [clientSecretFromTrakt],
    token2: ""
   }

var imdbapi = [[token1], [token2]]

var moviedb = {
    key1: [tmdbAPIKey]
}
```

## 📸 Screenshots
<img width="620" alt="image" src="https://user-images.githubusercontent.com/51235422/224584476-16366f10-4397-4f3d-8ae2-3c455198f352.png">
<img width="620" alt="image" src="https://user-images.githubusercontent.com/51235422/224584588-e46ffcdb-5cf1-4207-9f1c-785f3a581df1.png">
<img width="620" alt="image" src="https://user-images.githubusercontent.com/51235422/224585116-89028bbe-ab86-44a8-81e7-e5e4afe863f7.png">

## 🎬 Status 
Project submitted for grading

## 🔮 Possible Future Features
- more data in top250 list
- improving speed of API calls
- additionally to removing undesired genres, searching for desired genres
- ability to sort watched movies and movies in theater
- improving CSS and design
- more statistics about watched movies
- ability to rate movies
