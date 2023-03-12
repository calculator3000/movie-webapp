const imdbApiKey = imdbapi;
const omdbApiKey = omdbapi.key3;
const moviedbApiKey = moviedb.key1;
const username = traktapi.username;
let numRequestsCompleted = 0;
let clientId = traktapi.clientId;
var token2 = traktapi.token2;
let baseurl = "https://image.tmdb.org/t/p/w154/"

var watchedArr = []


// Initialize the key index to 0
let keyIndex = 0;

// Define a function to get the next available key
function getNextKey() {
  keyIndex = (keyIndex + 1) % imdbApiKey.length;
  return imdbApiKey[keyIndex];
}

// colors with transparency 30-50
// https://www.w3schools.com/colors/colors_names.asp
const genreColors = {
    Action: "#4682B430", // steel blue
    Adventure: "#6B8E2330", // olive green
    Animation: "#FFA50030", // orange
    Biography: "#0000CD30", //medium blue
    Comedy: "#FF8C0030", // dark orange
    Crime: "#D3D3D330", //light grey
    Documentary: "#1E90FF10", // dodger blue
    Drama: "#DC143C30", // crimson
    Family: "#00BFFF30", // deep sky blue
    Fantasy: "#FFFACD", // lemon chiffon
    "Film-Noir": "#2E8B5730", // sea green
    History: "#FFA50030",	// orange
    Horror: "#556B2F50", // dark olive green
    Music: "#B0E0E6", // powder blue
    Musical: "#FFD70030", // gold
    Mystery: "#70809030", // slate grey
    Romance: "rgba(255, 0, 0, 0.2)", // semi-transparent red
    "Sci-Fi": "#6A5ACD30", // slate blue
    "Short Film": "#f5fffa", // mintcream
    Sport: "#FDF5E6", // OldLace
    Superhero: "#F0FFF0", // HoneyDew
    Thriller: "#FFB6C130", // light pink
    War: "#90ee9020", // light green
    Western: "#DEB88750" // semi-transparent burly wood
};


/** 
 * calls imdb API to get top250 movies
 * and calls populateMovies with the data
 */
// Gets the top250 movies from the json file and assigns the response data to movieData
async function getTop250Movies() {
    let url = `https://imdb-api.com/en/API/Top250Movies/${imdbApiKey[keyIndex]}`;
    // Try to access the APi via key
    try {
        const response = await fetch(url);
        const movieData = await response.json();
        if ((movieData.errorMessage === 'Invalid API Key') 
        || (movieData.status === 'Invalid API Key') 
        || (movieData.errorMessage.includes("Maximum usage"))) {
            // If the API key is invalid, try the next one
            keyIndex++;
            if (keyIndex >= imdbApiKey.length) {
              throw new Error('All API keys are invalid');
            }
            return await getTop250Movies(url);
        } else{ 
            // Call the function populateMovies 
            populateMovies(movieData);
        }
    } catch (error) {
        console.error('Error fetching Top 250 data:', error);
    }
}

/**
 * populateMovies takes argument data (a JSON file containing top250 imdb movies).
 * it populates index.html top250 id with movie data
 * and adds modals
 * @param {json} data - JSON file
 */
function populateMovies(data) {
    console.log(data);
    const section = document.querySelector('#top250'); // select the sections 
    const movies = data.items;

    // loop through the elements of the movies array, get title and image from JSON to display on webapp
    for (const movie of movies) {
        const movie_card = document.createElement('li');
        movie_card.setAttribute("id", "movieitem")

        // Get the modal and close-button
        let modal = document.getElementById("myModal");
        let span = document.getElementsByClassName("close")[0];
        movie_card.onclick = function() {
            modal.style.display = "block";
        }
        span.onclick = function() {
            modal.style.display = "none";
        }
        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
            modal.style.display = "none";
            }
        }
        // get Wikipedia info from API and fill the modal
        movie_card.addEventListener("click", function() {
            getWiki(movie.id)
        })
        movie_card.addEventListener("click", function() {
            let modal_actors = document.getElementById("modal_actors");
            modal_actors.innerHTML = `${movie.crew}`;
            
            let modal_image = document.getElementById('modal_img');
            modal_image.src = movie.image;
        })

        const movie_image = document.createElement('img');
        movie_image.src = movie.image;
        movie_image.setAttribute("class", "movie_image")
        
        const movie_title = document.createElement('div'); // creates new element
        movie_title.innerHTML = `${movie.rank}. ${movie.title}`; // fill the p element with the title
        movie_title.setAttribute("class", "title")
 
        const movie_year = document.createElement('div');
        movie_year.innerHTML = `${movie.year}`;

        const movie_rating = document.createElement('div');
        movie_rating.innerHTML = `${movie.imDbRating}`;

        movie_card.appendChild(movie_image);
        movie_card.appendChild(movie_title);
        movie_card.appendChild(movie_year);
        movie_card.appendChild(movie_rating);

        section.appendChild(movie_card);
    }
}

/**
 * calls the IMDB-API to retrieve wikipedia data for the movie
 * @param {*} id - the IMDB id of the movey
 */
async function getWiki(id) {
    let movie_id = id
    let url = `https://imdb-api.com/en/API/Wikipedia/${imdbApiKey[keyIndex]}/${movie_id}`;
    // Try the different keys for the API, if one is not working get next one
    try {
        const response = await fetch(url);
        const datawiki = await response.json();
        console.log(response.status);
        
        if ((datawiki.errorMessage === 'Invalid API Key') 
        || (datawiki.status === 'Invalid API Key') 
        || (datawiki.errorMessage.includes("Maximum usage"))) {
            // If the API key is invalid, try the next one
            keyIndex++;
            if (keyIndex >= imdbApiKey.length) {
              throw new Error('All API keys are invalid');
            }
            return await getWiki(url);
        } else{ 
            let modal_title = document.getElementById("modal_title");
            modal_title.innerHTML = `${datawiki.fullTitle}`;

            let modal_text = document.getElementById("modal_text");
            modal_text.innerHTML = datawiki.plotShort.plainText;
        }
    } catch (error) {
        console.error('Error fetching wikipedia data:', error);
        }
}
  
/**
 * if the user has selected the Theater Tab, the movies currently in theater will be called
 * from IMDB api and the function populateTheaterGallery will be called afterwards
 */
async function getInTheatersForTheaterTab() {
    let url = `https://imdb-api.com/en/API/InTheaters/${imdbApiKey[keyIndex]}`;

    // Add try/catch in order to handle errors in fetch statement
    try {
        const response = await fetch(url);
        const theaterData = await response.json();
        console.log(response.status);
        // In theaters data is used in homepage and in_theaters page, so call function where page is open
        if ((theaterData.errorMessage === 'Invalid API Key') 
        || (theaterData.status === 'Invalid API Key') 
        || (theaterData.errorMessage.includes("Maximum usage"))) {
            // If the API key is invalid, try the next one
            keyIndex++;
            if (keyIndex >= imdbApiKey.length) {
              throw new Error('All API keys are invalid');
            }
            return await getInTheatersForTheaterTab(url);
        } else{ 
                populateTheaterGallery(theaterData);  
        }
      } catch (error) {
        console.error('Error fetching theater data:', error);
        }
}

/**
 * if the user has selected the Theater Tab, the movies currently in theater will be called
 * from IMDB api and the function displayRandomElements will be called afterwards
 */
async function getInTheatersForIndexTab() {
    let url = `https://imdb-api.com/en/API/InTheaters/${imdbApiKey[keyIndex]}`;

    // Add try/catch in order to handle errors in fetch statement
    try {
        const response = await fetch(url);
        const theaterData = await response.json();
        console.log(response.status);
        // In theaters data is used in homepage and in_theaters page, so call function where page is open
        if ((theaterData.errorMessage === 'Invalid API Key') 
        || (theaterData.status === 'Invalid API Key') 
        || (theaterData.errorMessage.includes("Maximum usage"))) {
            // If the API key is invalid, try the next one
            keyIndex++;
            if (keyIndex >= imdbApiKey.length) {
              throw new Error('All API keys are invalid');
            }
            return await getInTheatersForIndexTab(url);
        } else{ 
            console.log("here")
            displayRandomElements(theaterData);
        }
      } catch (error) {
        console.error('Error fetching theater data:', error);
        }
}

/**
 * sort the Table
 * @param {*} n - tbd
 */
function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("top250");
    switching = true;
    dir = "asc";
    /* Make a loop that will continue until no switching needed: */
    while (switching) {
      switching = false;
      rows = movieitem;
      for (i = 0; i < (rows.length - 1); i++) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName("DIV")[n];
        y = rows[i + 1].getElementsByTagName("DIV")[n];
        // Check if the two rows should switch place
        if (dir == "asc") {
          if (parseFloat(x.innerHTML) > parseFloat(y.innerHTML)) {
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (parseFloat(x.innerHTML) < parseFloat(y.innerHTML)) {
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        // Each time a switch is done, increase count by 1:
        switchcount ++;
      } else {
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }


/**
 * filter for range of years
 */
function controlFromInput(fromSlider, fromInput, toInput, controlSlider) {
    const [from, to] = getParsed(fromInput, toInput);
    fillSlider(fromInput, toInput, '#C6C6C6', '#fba92c', controlSlider);
    if (from > to) {
        fromSlider.value = to;
        fromInput.value = to;
    } else {
        fromSlider.value = from;
    }
}

function controlToInput(toSlider, fromInput, toInput, controlSlider) {
    const [from, to] = getParsed(fromInput, toInput);
    fillSlider(fromInput, toInput, '#C6C6C6', '#fba92c', controlSlider);
    setToggleAccessible(toInput);
    if (from <= to) {
        toSlider.value = to;
        toInput.value = to;
    } else {
        toInput.value = from;
    }
}

function controlFromSlider(fromSlider, toSlider, fromInput) {
    const [from, to] = getParsed(fromSlider, toSlider);
    fillSlider(fromSlider, toSlider, '#C6C6C6', '#fba92c', toSlider);
    if (from > to) {
      fromSlider.value = to;
      fromInput.value = to;
    } else {
      fromInput.value = from;
    }
  }
  
function controlToSlider(fromSlider, toSlider, toInput) {
    const [from, to] = getParsed(fromSlider, toSlider);
    fillSlider(fromSlider, toSlider, '#C6C6C6', '#fba92c', toSlider);
    setToggleAccessible(toSlider);
    if (from <= to) {
      toSlider.value = to;
      toInput.value = to;
    } else {
      toInput.value = from;
      toSlider.value = from;
    }
  }
  
function getParsed(currentFrom, currentTo) {
    const from = parseInt(currentFrom.value, 10);
    const to = parseInt(currentTo.value, 10);
    return [from, to];
  }
  
function fillSlider(from, to, sliderColor, rangeColor, controlSlider) {
      const rangeDistance = to.max-to.min;
      const fromPosition = from.value - to.min;
      const toPosition = to.value - to.min;
      controlSlider.style.background = `linear-gradient(
        to right,
        ${sliderColor} 0%,
        ${sliderColor} ${(fromPosition)/(rangeDistance)*100}%,
        ${rangeColor} ${((fromPosition)/(rangeDistance))*100}%,
        ${rangeColor} ${(toPosition)/(rangeDistance)*100}%, 
        ${sliderColor} ${(toPosition)/(rangeDistance)*100}%, 
        ${sliderColor} 100%)`;
  }
  
function setToggleAccessible(currentTarget) {
    const toSlider = document.querySelector('#toSlider');
    if (Number(currentTarget.value) <= 0 ) {
      toSlider.style.zIndex = 2;
    } else {
      toSlider.style.zIndex = 0;
    }
  }

function filterForYear() {
    const fromSlider = document.querySelector('#fromSlider');
    const toSlider = document.querySelector('#toSlider');
    const fromInput = document.querySelector('#fromInput');
    const toInput = document.querySelector('#toInput');
    fillSlider(fromSlider, toSlider, '#C6C6C6', '#fba92c', toSlider);
    setToggleAccessible(toSlider);
      
    fromSlider.oninput = () => controlFromSlider(fromSlider, toSlider, fromInput);
    toSlider.oninput = () => controlToSlider(fromSlider, toSlider, toInput);

    //clear previously filtered before
    var errorMessage = document.querySelector(".noMovies");
    if (errorMessage) {
        errorMessage.remove();
    }

    table = document.getElementById("top250");
    rows = movieitem;
    for (i = 0; i < rows.length; i++) {
        rows[i].style.display = "";
    }

    var sliderMin = document.getElementById("fromSlider");
    var outputMin = document.getElementById("fromInput");
    outputMin.innerHTML = sliderMin.value;
    sliderMin.oninput = function() {
        outputMin.innerHTML = this.value;
    }

    var sliderMax = document.getElementById("toSlider");
    var outputMax = document.getElementById("toInput");
    outputMax.innerHTML = sliderMax.value;
    sliderMax.oninput = function() {
        outputMax.innerHTML = this.value;
    }

    count = 0
    //use output as filter
    filterMax = document.getElementById("toInput");
    filterMin = document.getElementById("fromInput")
    // Loop through all table rows, and hide those who don't match
    for (i = 0; i < rows.length; i++) {
        td = rows[i].getElementsByTagName("DIV")[1];
    	if ((parseInt(td.innerHTML) < parseInt(filterMax.innerHTML) + 1) && (parseInt(
            td.innerHTML) > parseInt(filterMin.innerHTML) - 1)) {
            rows[i].style.display = " ";
            count = count + 1
        } else {
            rows[i].style.display ="none";
        }
    }

    var total = document.getElementById("total_year");
    total.innerHTML = count

    if (count === 0) {
        var errorMessage = document.createElement("p");
        errorMessage.innerHTML = "No movies found within the specified range of years.";
        errorMessage.setAttribute("class", "noMovies")
        document.body.appendChild(errorMessage);
    }
}

/**
 * search for movie actor
 */
async function searchMovieActor() {
    let url = `https://imdb-api.com/en/API/Top250Movies/${imdbApiKey[keyIndex]}`;
        try {
            const response = await fetch(url);
            const movieData = await response.json();
            console.log(movieData.status);
            if ((movieData.errorMessage === 'Invalid API Key') 
            || (movieData.status === 'Invalid API Key') 
            || (movieData.errorMessage.includes("Maximum usage"))) { 
            // If the API key is invalid, try the next one
                keyIndex++;
                if (keyIndex >= imdbApiKey.length) {
                throw new Error('All API keys are invalid');
                }
                return await getMoviesFromJsonFile(url);
            } else{ 
                console.log(movieData)
                var input, filter, table_movie, rows_movie, td, i, txtValue;
                input = document.getElementById("myInput");
                filter = input.value.toUpperCase();
                table_movie = document.getElementById("top250");
                rows_movie = movieitem;
                let movies = movieData.items;

                var errorMessage = document.querySelector(".noMovies");
                if (errorMessage) {
                errorMessage.remove();
                }

                // Loop through all table rows, and hide those who don't match the search query
                for (i = 0; i < rows_movie.length; i++) {
                    td = rows_movie[i].getElementsByTagName("DIV")[0];
                        for (const movie1 of movies) {
                            let actors = movie1.crew;
                            let movie_name = movie1.title;
                            if (td) {
                                txtValue = td.textContent || td.innerText;
                                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                                    rows_movie[i].style.display = "";
                                } else if(actors.toUpperCase().indexOf(filter) > -1) {
                                    for (y=0; y < rows_movie.length; y++) {
                                        if (rows_movie[y].getElementsByTagName("DIV")[0].innerHTML.includes(movie_name) == true) {
                                            rows_movie[y].style.display = "";
                                        } 
                                    }   
                                } else {
                                    rows_movie[i].style.display = "none";
                                }
                            }
                        }
                };
                var count = 0;
                for (i = 0; i < rows_movie.length; i++) {
                if (rows_movie[i].style.display !== 'none')
                count++;
                }
        
                var total = document.getElementById("total_year");
                total.innerHTML = count;

                if (count === 0) {
                var errorMessage = document.createElement("p");
                errorMessage.innerHTML = "No movies found within the specified range of years.";
                errorMessage.setAttribute("class", "noMovies")
                document.body.appendChild(errorMessage);
                }
            }   
        } catch (error) {
            console.error('Error fetching Top 250 data:', error);
    }
}   

/**
 * populateTheaterGallery takes argument data.
 * it populates in_theaters.html gallery class with data about movies currently in theaters
 * and adds modals
 * @param {json} data - JSON file
 */
function populateTheaterGallery(data) {
    const section = document.querySelector('.gallery'); // select the sections
    const movies = data.items; 

    // loop through the elements of the movies array, get title and image from JSON to display on webapp
    for (const movie of movies) {
        const movieCard = document.createElement('article'); // create element article that all new elements will be appended to
        const genreList = document.createElement('ul'); // create element list that will contain the genre tags
        genreList.setAttribute("id", "genrelist")
        genreList.style["padding"] = "0px";

        const movImg = document.createElement('img');
        movImg.src = movie.image;
        movImg.setAttribute("id", "movImg")
        movieCard.appendChild(movImg);

        // Get the modal
        let modal = document.getElementById("myModal");
        // Get the <span> element that closes the modal
        let span = document.getElementsByClassName("close")[0];
        // When the user clicks on the button, open the modal
        movImg.onclick = function() {
            modal.style.display = "block";
        }
        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            modal.style.display = "none";
        }
        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
            modal.style.display = "none";
            }
        }
        // get Wikipedia info from API and fill the modal
        movImg.addEventListener("click", function() {
            getWiki(movie.id)
        })
        movImg.addEventListener("click", function() {
            let modal_runtime = document.getElementById("modal_runtime");
            modal_runtime.innerHTML = movie.runtimeMins;
            
            let modal_image = document.getElementById('modal_img');
            modal_image.src = movie.image;

            let modal_rating = document.getElementById("modal_rating");
            modal_rating.innerHTML = movie.imDbRating;
        })
        
        // movie title
        const movTitle = document.createElement('p'); // creates new element
        movTitle.textContent = `${movie.title}`; // fill the p element with the title
        movTitle.setAttribute("class", "theater_title")
        movieCard.appendChild(movTitle);

        // button
        const addMovieButton = document.createElement('button')
        addMovieButton.innerHTML = 'Add to watchlist';
        addMovieButton.addEventListener("click", function() {
            addToWatchlist(movie.id);
        });
        movieCard.appendChild(addMovieButton)

        // movie genre in little tags that change color according to genre
        for (const genre of movie.genreList) {
            const movGenre = document.createElement('li'); // creates new element
            genreName = genre.key;
            movGenre.textContent = genreName;

            // get color mapping from genreColors class
            const genreColor = genreColors[genreName];
            // later move to CSS
            movGenre.style["background-color"] = genreColor;
            movGenre.style["border-radius"] = "10px";
            movGenre.style["font-size"] = "8px";
            movGenre.style["text-align"] = "center";
            movGenre.style.padding = "2px 5px";
            movGenre.style["list-style"] = "none";
            movGenre.style.display = "inline-block";
            movGenre.style.margin = "2px";
            
            // append the genre li elements to the genreList ul element
            genreList.appendChild(movGenre);            
        }

        // append the element to the section
        movieCard.appendChild(genreList); // append the genreList ul element to movieCard article element
        section.appendChild(movieCard); // append the movieCard article to the section selector (selected .gallery)
    }
    const genreFilters = document.createElement('div'); // create a container for the genre filters
    genreFilters.setAttribute("class", "genrefilters")
    section.insertBefore(genreFilters, section.firstChild); // insert the container before the first child of the section element

    const genreTypes = []; // create an array to store the genre types
    for (const movie of movies) {
    for (const genre of movie.genreList) {
        const genreName = genre.key;
        if (!genreTypes.includes(genreName)) {
        genreTypes.push(genreName); // add the genre type to the array if it's not already there
        }
    }
    }

    genreTypes.sort();
    const genreFiltersState = {}; // create an object to store the filter state for each genre

    for (const genre of genreTypes) {
      const genreFilter = document.createElement('div'); // create a filter element for each genre
      genreFilter.textContent = genre;
      genreFilter.style.backgroundColor = genreColors[genre];

      genreFilter.setAttribute("class", "genrefilter")
      genreFilters.appendChild(genreFilter);
    
      genreFiltersState[genre] = true; // initialize filter state for this genre to true
    
      genreFilter.addEventListener('click', () => {
        const currentFilterState = genreFiltersState[genre];
    
        if (currentFilterState) {
          // if filter is currently active, deactivate it
          genreFiltersState[genre] = false;
          genreFilter.style.backgroundColor = "white";
          for (const movieCard of section.querySelectorAll('article')) {
            const genreList = movieCard.querySelector('ul');
            if (genreList.textContent.includes(genre)) {
              movieCard.style.display = "none";
            }
          }
        } else {
          // if filter is currently inactive, activate it
          genreFiltersState[genre] = true;
          genreFilter.style.backgroundColor = genreColors[genre];
          for (const movieCard of section.querySelectorAll('article')) {
            const genreList = movieCard.querySelector('ul');
            if (genreList.textContent.includes(genre)) {
              movieCard.style.display = "";
            }
          }
        }
      });
    }
}

/**
 * calls trakt-api to get the watched movies for the user (username defined in config file)
 * for every movie watched, call getMovData to get more data than available from trakt-api
 * once all data is received from getMovData, call generateWatchedStats to display the movie data
 */
function getWatchedForStats() {
    console.log("1. In GetWatched")
    const url = `https://api.trakt.tv/users/${username}/watched/movies`;
  
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
    .then(watched => {
        // for every movie in watched list, get more data from OMDB
        // once completed, call populateWatchedGallery()
        for (const movie of watched) {
            imdbId = movie.movie.ids.imdb;
            // only call the callback function once all requests have been completed and the data is stored in watchedArr
            getMovData(imdbId, function() { 
                numRequestsCompleted++;
                // populate gallery once all API calls are complete
                if((numRequestsCompleted === watched.length)) {
                    generateWatchedStats(watched);
                }
            })
        } 
    })
    .catch(error => console.error('Error:', error));
}

/**
 * calls trakt-api to get the watched movies for the user (username defined in config file)
 * for every movie watched, call getMovData to get more data than available from trakt-api
 * once all data is received from getMovData, call populateWatchedGallery to display the movie data
 */
function getWatchedForGallery() {
    console.log("1. In GetWatched")
    const url = `https://api.trakt.tv/users/${username}/watched/movies`;
  
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
    .then(watched => {
        // for every movie in watched list, get more data from OMDB
        // once completed, call populateWatchedGallery()
        for (const movie of watched) {
            imdbId = movie.movie.ids.imdb;
            // only call the callback function once all requests have been completed and the data is stored in watchedArr
            getMovData(imdbId, function() { 
                numRequestsCompleted++;
                // populate gallery once all API calls are complete
                if((numRequestsCompleted === watched.length)) {
                    populateWatchedGallery();
                }
            })
        }
    })
    .catch(error => console.error('Error:', error));
}

/**
 * get movie data from the movie DB-Api
 * @param {*} imdbId - the imdb id for the movie
 * @param {function} callback - callback function
 */
function getMovData(imdbId, callback) {
    console.log("3. in GetMovData")
    // check if the function has already been called before
    if (watchedArr.length > 0) {
        callback();
        console.log("was already filled")
    } else {
        let url = `https://api.themoviedb.org/3/movie/${imdbId}?api_key=${moviedbApiKey}&language=en-US`
        fetch(url)
        .then(response => response.json())
        // add the detailed movie data to the watchedArray, 
        // because the flex gallery loops through an array to populate the cards with data 
        .then(data => {watchedArr.push(data); callback()}); 
    }
}

/**
 * display the data of the watched movies in a gallery
 * movie title, movie poster, movie genres
 */
function populateWatchedGallery() {
    console.log("4. in populateWatchedGallery")
    console.log(watchedArr)

    for (const watchedMov of watchedArr) { 
        const section = document.querySelector('.gallery'); // select the sections
        const movieCard = document.createElement('article'); // create element article that all new elements will be appended to
        const genreList = document.createElement('ul'); // create element list that will contain the genre tags
        genreList.setAttribute("id", "genrelist")
        genreList.style["padding"] = "0px";
        genreList.style.width = "130px";
        genreList.style["text-align"] = "center";

        // cover poster of the movie
        const movImg = document.createElement('img');
        let posterPath = watchedMov.poster_path
        let imgUrl = baseurl + posterPath
        movImg.src = imgUrl;
        movImg.setAttribute("id", "movImg")
        movieCard.appendChild(movImg);

        // movie title
        const movTitle = document.createElement('p'); // creates new element
        movTitle.textContent = `${watchedMov.title}`; // fill the p element with the title
        movTitle.setAttribute("class", "theater_title")
        movieCard.appendChild(movTitle);

        // genres
        var genres = watchedMov.genres

        for (const genre of genres) {
            let genreName = genre.name
            const movGenre = document.createElement('li'); // creates new element
            movGenre.textContent = genreName;

            // get color mapping from genreColors class
            const genreColor = genreColors[genreName];
            movGenre.style["background-color"] = genreColor;
            movGenre.style["border-radius"] = "10px";
            movGenre.style["font-size"] = "8px";
            movGenre.style["text-align"] = "center";
            movGenre.style.padding = "2px 5px";
            movGenre.style["list-style"] = "none";
            movGenre.style.display = "inline-block";
            movGenre.style.margin = "2px";
            
            // append the genre li elements to the genreList ul element
            genreList.appendChild(movGenre);   
        }
        // append the element to the section
        movieCard.appendChild(genreList); // append the genreList ul element to movieCard article element
        section.appendChild(movieCard); // append the movieCard article to the section selector (selected .gallery)
    }
}

// /**
//  * display the data of the watched movies in a gallery
//  * movie title, movie poster, movie genres
//  */
// function populateWatchedGallery() {
//     console.log("3. in populateWatchedGallery")
//     console.log(watchedArr)

//     for (const watchedMov of watchedArr) { 
//         const section = document.querySelector('.gallery'); // select the sections
//         const movieCard = document.createElement('article'); // create element article that all new elements will be appended to
//         const genreList = document.createElement('ul'); // create element list that will contain the genre tags
//         genreList.setAttribute("id", "genrelist")
//         genreList.style["padding"] = "0px";

//         // cover poster of the movie
//         const movImg = document.createElement('img');
//         movImg.src = watchedMov.Poster;
//         movImg.setAttribute("id", "movImg")
//         movieCard.appendChild(movImg);

//         // movie title
//         const movTitle = document.createElement('p'); // creates new element
//         movTitle.textContent = `${watchedMov.Title}`; // fill the p element with the title
//         movTitle.setAttribute("class", "theater_title")
//         movieCard.appendChild(movTitle);

//         // genres
//         var genres = watchedMov.Genre
//         const genreArr = genres.split(", ");

//         for (const genre of genreArr) {
//             const movGenre = document.createElement('li'); // creates new element
//             movGenre.textContent = genre;

//             // get color mapping from genreColors class
//             const genreColor = genreColors[genre];
//             movGenre.style["background-color"] = genreColor;
//             movGenre.style["border-radius"] = "10px";
//             movGenre.style["font-size"] = "8px";
//             movGenre.style["text-align"] = "center";
//             movGenre.style.padding = "2px 5px";
//             movGenre.style["list-style"] = "none";
//             movGenre.style.display = "inline-block";
//             movGenre.style.margin = "2px";
            
//             // append the genre li elements to the genreList ul element
//             genreList.appendChild(movGenre);   
//         }
//         // append the element to the section
//         movieCard.appendChild(genreList); // append the genreList ul element to movieCard article element
//         section.appendChild(movieCard); // append the movieCard article to the section selector (selected .gallery)
//     }
// }

/**
 * displayRandomElements takes argument data.
 * it displays four random movies in index.html of the in theater movies
 * @param {json} data - JSON file
 */
function displayRandomElements(data) {
    // Get ids of the movie data, choose four random ids and store in array
    const elements = data.items.map(user => user.id);
    const randomElements = [];
    while (randomElements.length < 4) {
      const randomIndex = Math.floor(Math.random() * elements.length);
      const randomElement = elements[randomIndex];
      if (!randomElements.includes(randomElement)) {
        randomElements.push(randomElement);
      }
    }
  
    // Generate a random index within the range of the array's length
    const randomIndex = Math.floor(Math.random() * elements.length);

    // Access the element at the random index
    const randomElement = elements[randomIndex];
    console.log(randomElement)

    // Call function getyoutube
    getYouTube(randomElement)

    // get title, rank, plot and image for each of the four random movies and create html id
    for (let i = 0; i < randomElements.length; i++) {
      const id = randomElements[i];
      const title = data.items.find(x => x.id === id).title;
      const ranking = data.items.find(x => x.id === id).imDbRating;
      const plot = data.items.find(x => x.id === id).plot;
      const img = data.items.find(x => x.id === id).image;

      const elementTitle = document.getElementById(`element_${i + 1}_title`);
      elementTitle.textContent = title;

      const elementPlot = document.getElementById(`element_${i + 1}_plot`);
      elementPlot.textContent = plot;

      const elementRanking = document.getElementById(`element_${i + 1}_ranking`);
      elementRanking.textContent = ranking;
      const elementImage = document.getElementById(`element_${i + 1}_image`);
      elementImage.setAttribute('src', img);
    }    
}

/**

 * getYouTube takes argument id.
 * it fetches information from imDb YouTube API and gets year, title and URL of trailer
 * @param {json} data - JSON file
 */
async function getYouTube(id) {
    let movie_id = id
    let url = `https://imdb-api.com/en/API/YouTubeTrailer/${imdbApiKey[keyIndex]}/${movie_id}`;
    // Try to make API call and store information in json object
    try {
        const response = await fetch(url);
        const trailer = await response.json();
        console.log(trailer.status);
        if ((trailer.errorMessage === 'Invalid API Key') 
        || (trailer.status === 'Invalid API Key') 
        || (trailer.errorMessage.includes("Maximum usage"))) {
            // If the API key is invalid, try the next one
            keyIndex++;
            if (keyIndex >= imdbApiKey.length) {
              throw new Error('All API keys are invalid');
            }
            return await getYouTube(url);
        } else{ 
            if (trailer.videoUrl) {
                // get URL, title and year of movie
                const trailer_link = document.getElementById("trailer_url");
                const embeddedUrl = trailer.videoUrl.replace("watch?v=", "embed/");
                trailer_link.setAttribute('src', embeddedUrl);
            
                const trailer_title = document.getElementById("trailer_title");
                trailer_title.innerHTML = `${trailer.title}`;
            
                const trailer_year = document.getElementById("trailer_year");
                trailer_year.innerHTML = trailer.year;
                
            } else {
                // if there is no trailer to id, display other youtube video
                const trailer_link = document.getElementById("trailer_url");
                const embeddedUrl = "https://www.youtube.com/embed/KTSiBVZMy6U"
                trailer_link.setAttribute('src', embeddedUrl);
            }
        }
    } catch (error) {
        console.error('Error fetching trailer data:', error);
    }
}

/**
 * calls trakt api to get user statistics (how many movies and hours watched)
 * then calls displayUserStats function to display the statistics in UI
 */
function getUserStats() {
    let url = `https://api.trakt.tv/users/${username}/stats`;
    
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'trakt-api-version': '2',
            'trakt-api-key': clientId //,
        }
    })
    .then(response => {
        console.log('Status:', response.status);
        console.log('Headers:', response.headers);
        return response.json(); 
    })
    .then(body => {
        console.log('Body:', body);
        displayUserStats(body);
    })
}

/**
 * display the user statistics (how many movies watched and how many minutes) in the UI
 * @param {*} stats - object
 */
function displayUserStats(stats) {
    // convert the number of minutes watched into days, hours, minutes
    let minMovies = convertMinutes(stats.movies.minutes);
    let numMovies = stats.movies.watched

    // display the statistics about minutes spend watching movies and # movies watched in the UI
    document.getElementById("days").innerText = minMovies[0];
    document.getElementById("hours").innerText = minMovies[1];
    document.getElementById("minutes").innerText = minMovies[2];
    document.getElementById("watched").innerText = numMovies
}

/**
 * convert parameter min into days, hours, and minutes
 * @param {*} min - how many minutes a user has watched movies
 * @returns array - containing the days, hours, minutes
 */
function convertMinutes(min) {
    var days = Math.floor(min / 1440);
    var hours = Math.floor((min % 1440) / 60);
    var minutes = min % 60;
    return [days, hours, minutes]
}

/**
 * create objects containing data to be used in the creation of charts
 * call the functions to create the charts and fill the UI with data
 * @param {object} watchedData - extensive data about each movie watched
 */
function generateWatchedStats() {
    // set variables for objects containing data to be used in creation of the charts
    let genreCount = {}; // format: {Action: 1, Adventure: 1, Fantasy: 1, ...}
    let yearCount = {}; // format: {1989: 1, 1990: 1}
    let minRating = {}; // format: {Title: "JurassicPark", Rating: 6.1, Poster: "http://..."}
    let maxRating = {}; // format: {Title: "Lord of the Rings", Rating: 9.3, Poster: "http://..."}
    let langCount = {}; // format: {English: 30, Mandarin: 1}
    let actorCount = {};
    let countryCount = {}; 
    // set initial values for lowest and highest rated films
    let lowestRating = 10.0;
    let highestRating = 0.0;
    console.log(watchedArr)

    // for each movie, fill the objects initialized above to contain the data
    for (const movie of watchedArr) {
        let genres = movie.genres // format: Genre: "Action, Adventure, Fantasy"
        // format: [0:  {id: 18, name: 'Drama'}, 1: {id: 35, name: 'Comedy'}, 2: {id: 80, name: 'Crime'}]
        let year = movie.release_date.substring(0, 4); // format "2003-07-09"
        let rating = movie.vote_average; // movieDB rating
        let language = movie.original_language // original_language
        // let actors = 
        // let actorSplit = movie.Actors.split(", ")
        let countries = movie.production_countries;
        // let countrySplit = movie.Country.split(", ");

        // GENRES: count how many times each genre appears in movies watched & populate genreObject with data
        // if movie has multiple genres, all genres will be counted
        for (const genre of genres) { 
            genreCount = createCounterObject(genre.name, genreCount) 
        }
    
        // YEARS: count how many times each release year appears in movies watched & populate yearCount with data
        yearCount = createCounterObject(year, yearCount)

        // RATINGS: check what was the lowest and the highest rated movies watched (according to imdb rating)
        // check if the current movie has a lower rating than the current lowest rating
        if (rating < lowestRating) {
            lowestRating = rating;
            minRating["Title"] = movie.title;
            minRating["Rating"] = rating;
            minRating["Poster"] = baseurl + movie.poster_path;
        }
        // check if the current movie has a higher rating than the current highest rating
        if (rating > highestRating) {
            highestRating = rating;
            maxRating["Title"] = movie.title;
            maxRating["Rating"] = rating;
            maxRating["Poster"] = baseurl + movie.poster_path;
        }

        // COUNTRIES: 
        for (const country of countries) { 
            countryCount = createCounterObject(country.name, countryCount) 
        }

    //     // ACTORS
    //     for (const actor of actorSplit) { 
    //         actorCount = createCounterObject(actor, actorCount) 
    //     }

        // LANGUAGES: note only first language
        langCount = createCounterObject(language, langCount)
    }

    // Sort the objects (from high to low) by creating a list of objects
    // and call functions to display the data in a chart
    // GENRES: sort the genres (high - low) and call function displaying data in a chart
        let genreCountSort = createSortedCounter(genreCount, true)
        displayGenreStats(genreCountSort[0], genreCountSort[1], genreCountSort[2])

    // YEAR: year barchart should also include release years from which no movies where watched
        let years = Object.keys(yearCount).map(Number);
        let minYear = Math.min(...years);
        let maxYear = 2023;

        // if year does not appear in the watched movie data, put 0 as a counter
        for(let i=minYear; i<=maxYear; i++) {
            if(!years.includes(i)) {
                yearCount[i] = 0
            } 
        }
        displayYearStats(yearCount);

    // RATINGS: call function to display title, poster, and rating of lowest and highest rated watched movies
        displayLowHighRatedMovie(minRating, maxRating);

    // COUNTRIES: sort the countries (high - low) and display in a chart
        var countryCountSort = createSortedCounter(countryCount)
        displayCountryStats(countryCountSort[0], countryCountSort[1])

    // LANGUAGES: sort the countries (high - low) and display in a chart
        let langCountSort = createSortedCounter(langCount)
        displayLanguageStats(langCountSort[0], langCountSort[1])

    // // ACTORS: sort the actors (high - low) and display top 6 actors
    //     var actorsCountSort = createSortedCounter(actorCount)
    //     for (let i=0; i < 6; i++) {
    //         let actorname = actorsCountSort[0][i]
    //         let actorCount = actorsCountSort[1][i]
    //         // call function to retrieve pictures of actors from the movie db
    //         getActorPoster(actorname, actorCount, i)
    //     }
}

/**
 * counts how many times each variable appears in movies watched and populate object with data
 * returns object with key-value pair of variable: count
 * @param {string} variable - e.g. year
 * @param {object} object - empty object {}
 * @returns {object} object - exemplary format: {1989: 1, 1990: 1, ...}
 */
function createCounterObject(variable, object) {
    if(variable in object) {
        object[variable] += 1;
    } else {
        object[variable] = 1;
    }
    return object;
}

/**
 * call themoviedb-api to get the picture of the actor
 * @param {string} actor - the name of the actor
 * @param {*} actorCount - how many times the actor has appeared in watched movies
 * @param {int} functionCounter - how many times has this function now been called (to track if its the top1 actor, top2, etc.)
 */
function getActorPoster(actor, actorCount, functionCounter) {
    let imagePath = ""
    let url = `https://api.themoviedb.org/3/search/person?api_key=${moviedbApiKey}&language=en-US&query=${actor}&page=1&include_adult=false`
    
    fetch(url)
    .then(response => response.json())
    .then(data => {
        imagePath = data.results[0].profile_path 
        displayTopActors(imagePath, actor, actorCount, functionCounter)
    });
}

/**
 * displays for the top6 actors of movies watched the image, name, and # of times appeared in movie
 * @param {string} imgPath - the path to the image of the actor
 * @param {string} actor - the name of the actor
 * @param {*} actorCount - how many times the actor has appeared in watched movies
 * @param {int} functionCounter - how many times has this function been called (to track the elementID)
 */
function displayTopActors(imgPath, actor, actorCount, functionCounter) {
    let imgUrl = baseurl + imgPath
    var elementId = "top" + functionCounter
    let actorSection = document.getElementById(elementId)
    actorSection.getElementsByClassName("actorImg")[0].src = imgUrl
    actorSection.getElementsByClassName("actorName")[0].innerHTML = actor
    actorSection.getElementsByClassName("actorCount")[0].innerHTML = actorCount + " movies"
}

/**
 * creates a list of objects containing two to three properties
 * the labels and data will then be used in the creation of the chart
 * @param {object} object - the object to sort, format: {Action: 1, Adventure: 1, Fantasy: 1, ...}
 * @param {boolean} [hasColor=false]  - whether a specific color scheme should be defined
 * @returns {array} array - labels - the labels to be used in the chart
 * @returns {array} array - data - the data to be used in the chart
 */
function createSortedCounter(object, hasColor = false) {
    let labels = [];
    let data = [];
    let bckgColors = []

    // example format of result : [{label: 'adventure', count: 2, color: "#6B8E2330"}, ...]
        // label: e.g., genre
        // count: e.g., counting how many times genre appears in the movies watched
        // color: e.g. the color for the genre (from genreColor), to be used in the chart
    const countArr = Object.entries(object).map(([label, count]) => { 
        let result = { label, count }
        if (hasColor) {
            result.color = genreColors[label]
        }
        return result;
    });

    // sort the countArr from highest to lowest value
    const countSort = countArr.sort(function (b,a) { return a.count - b.count });

    // create new arrays containing the genre, count, and (optionally) color respectively
    // to be used in creation of the chart
    for (let i=0; i < countSort.length; i++) {
        labels.push(countSort[i].label)
        data.push(countSort[i].count)
        if (hasColor) {
            bckgColors.push(countSort[i].color)
        }
    }
    return [labels, data, bckgColors]
}

/**
 * display the lowest and highest rated watched movie in UI
 * @param {object} lowestRating - containing data about lowest rated watched movie, format: {Title: "JurassicPark", Rating: 6.1, Poster: "http://..."}
 * @param {object} highestRating - containing data about highest rated watched movie, format: {Title: "JurassicPark", Rating: 6.1, Poster: "http://..."}
 */
function displayLowHighRatedMovie(lowestRating, highestRating) {
    document.getElementById("lowScore").innerHTML = `${lowestRating.Rating}`;
    document.getElementById('lowPoster').src = lowestRating.Poster;
    document.getElementById('lowTitle').innerHTML = `${lowestRating.Title}`;
    document.getElementById("highScore").innerHTML = `${highestRating.Rating}`;
    document.getElementById('highPoster').src = highestRating.Poster;
    document.getElementById('highTitle').innerHTML = `${highestRating.Title}`;
}

/**
 * create and display chart with data about the first languages of movies
 * @param {array} labels - the labels of the chart (here the languages)
 * @param {array} data - the data of the chart (here how many times each language appeared in watched movie data)
 */
function displayLanguageStats(labels, data) {
    let canvasElement = document.getElementById("lang");
    let config = {
        type: "doughnut",
        data: {
            labels: labels,
            datasets: [
                {
                    label: '# of movies containing this language (as first language)',
                    data: data
                },
            ],
        },
        options: {
            plugins: {
                legend: {
                    display: true
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    }
    let langChart = new Chart(canvasElement, config)
}

/**
 * create and display chart with data about the production countries of movies
 * @param {array} labels - the labels of the chart (here the county)
 * @param {array} data - the data of the chart (here how many times each country appeared in watched movie data)
 */
function displayCountryStats(labels, data) {
    let canvasElement = document.getElementById("country");
    let config = {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: '# of movies from this country',
                    data: data,
                    backgroundColor: "#fba92c"
                },
            ],
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            indexAxis: 'y',
        }
    }
    let countryChart = new Chart(canvasElement, config)
}

/**
 * create and display chart with data about the genres of movies
 * @param {array} labels - the labels of the chart (here the genre)
 * @param {array} data - the data of the chart (here how many times each genre appeared in watched movie data)
 */
function displayGenreStats(labels, data, color) {
    let canvasElement = document.getElementById("genresChart");
    let config = {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: '# of movies containing this genre',
                    data: data,
                    backgroundColor: color
                },
            ],
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            }
        }
    let genreChart = new Chart(canvasElement, config)
}

/**
 * create and display chart with data about the release years of watched movies
 * @param {array} labels - the labels of the chart (here the years)
 * @param {array} data - the data of the chart (here how many times each year appeared in watched movie data)
 */
function displayYearStats(data) {
    var canvasElement = document.getElementById("years");
    var config = {
        type: "bar",
        data: { datasets: [ 
            { 
                data: data,
                backgroundColor: "#fba92c"
            }] },
        options: { 
            plugins: {
                legend: {
                    display: false
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: "x",
        }
    }
    var yearChart = new Chart(canvasElement, config)
}

/* Sending Email from Contact Section */

// console.log(emailjs);
function sendmail() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let message = document.getElementById("message").value;

        var contactParams = {
            from_name: name,
            from_email: email,
            message: message
        };

        emailjs.send('service_6k1j5kc', 'template_qbj48v3', contactParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                // Clear the input fields
                document.getElementById("name").value = '';
                document.getElementById("email").value = '';
                document.getElementById("message").value = '';
            }, function(error) {
                console.log('FAILED...', error);
    });
}

function addToWatchlist(imdbId) {
    console.log("Hello", imdbId)
    fetch('https://api.trakt.tv/sync/watchlist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token2}`,
      'trakt-api-key': clientId,
      'trakt-api-version': '2'
    },
    body: JSON.stringify({
      'movies': [
        {
          'ids': {
            'imdb': imdbId,
          },
        }
      ],
    })
  })
    .then(response => {
      console.log('Status:', response.status);
      console.log('Headers:', response.headers);
      return response.text();
    })
    .then(body => {
      console.log('Body:', body);
      if(body.includes(`{"added":{"movies":1`)) {
        window.alert("Movie successfully added to your watchlist!");
      } else {
        window.alert("Sorry, something went wrong! Are you logged in?");
      }
    })
    .catch(error => console.error(error));
}

