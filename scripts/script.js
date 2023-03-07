const imdbApiKey = imdbapi.key3;
const omdbApiKey = omdbapi.key1;
// const username = traktapi.username;
let numRequestsCompleted = 0;
let clientId = traktapi.clientId

var watchedArr = []

// colors with transparency 30-50
// https://www.w3schools.com/colors/colors_names.asp
const genreColors = {
    Action: "#4682B430", // steel blue
    Adventure: "#6B8E2330", // olive green
    Animation: "#FFA50030", // orange
    Biography: "light-blue",
    Comedy: "#FF8C0030", // dark orange
    Crime: "#00000040",
    Documentary: "#1E90FF30", // dodger blue
    Drama: "#DC143C30", // crimson
    // Family
    Fantasy: "#F5F5DC",
    // "Film Noir"
    // History	// gold
    Horror: "#556B2F50", // dark olive green
    Music: "#B0E0E6", //powder blue
    // Musical // orange
    Mystery: "#D3D3D3",
    Romance: "rgba(255, 0, 0, 0.2)", //semi-transparent red
    "Sci-Fi": "lightcyan", // light cyan
    // `Short Film`: "#f5fffa" // mintcream
    Sport: "#FDF5E6", //OldLace
    Superhero: "#F0FFF0", //HoneyDew
    Thriller: "#FFB6C1",
    War: "#90ee90", // light green
    Western: "#DEB88750" // semi-transparent burly wood
};


// ********** index.html, top250.json ********** 
// Gets the top250 movies from the json file and assigns the response data to movieData
async function getMoviesFromJsonFile() {
    // other way to write promise (needs async keyword). 
    const response = await fetch("json_files/top250.json");
    const movieData = await response.json();
    
    // call the function populateMovies 
    populateMovies(movieData);
}

async function getWiki(id) {
    let movie_id = id
    let url = `https://imdb-api.com/en/API/Wikipedia/${imdbApiKey}/${movie_id}`;
    const response = await fetch(url);      

    var datawiki = await response.json();
    console.log(datawiki);

    let modal_title = document.getElementById("modal_title");
    modal_title.innerHTML = `${datawiki.fullTitle}`;

    let modal_text = document.getElementById("modal_text");
    modal_text.innerHTML = datawiki.plotShort.plainText;
}

/**
 * populateMovies takes argument data.
 * it populates index.html top250 id with movie data
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

        // Get the modal
        let modal = document.getElementById("myModal");
        // Get the <span> element that closes the modal
        let span = document.getElementsByClassName("close")[0];
        // When the user clicks on the button, open the modal
        movie_card.onclick = function() {
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

        // append the element to the section

    }
}

//sort the table
function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("top250");
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      rows = movieitem;
      /* Loop through all table rows (except the
      first, which contains table headers): */
      for (i = 0; i < (rows.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Get the two elements you want to compare,
        one from current row and one from the next: */
        x = rows[i].getElementsByTagName("DIV")[n];
        y = rows[i + 1].getElementsByTagName("DIV")[n];
        /* Check if the two rows should switch place,
        based on the direction, asc or desc: */
        if (dir == "asc") {
          if (parseFloat(x.innerHTML) > parseFloat(y.innerHTML)) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (parseFloat(x.innerHTML) < parseFloat(y.innerHTML)) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        // Each time a switch is done, increase this count by 1:
        switchcount ++;
      } else {
        /* If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again. */
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }

//filter for years
function filterYears(){
    //clear previously filtered before
    var filter, table, rows, td, i;
    table = document.getElementById("top250");
    rows = movieitem;
    for (i = 0; i < rows.length; i++) {
        rows[i].style.display = "";
    }
    //output for slider
    var slider = document.getElementById("myRange");
    var output = document.getElementById("years");
    output.innerHTML = slider.value;

    slider.oninput = function() {
    output.innerHTML = this.value;
    }
    count = 0
    //use output as filter
    filter = document.getElementById("years");
    // Loop through all table rows, and hide those who don't match
    for (i = 0; i < rows.length; i++) {
        td = rows[i].getElementsByTagName("DIV")[1];
    	if (parseInt(td.innerHTML) < parseInt(filter.innerHTML) + 1) {
            rows[i].style.display = " ";
            count = count + 1
        } else {
            rows[i].style.display ="none";
        }
    }
    var total = document.getElementById("total_year");
    total.innerHTML = count
}

// ********** in_theaters.html, in_theaters.json **********
// Gets the movies in theaters from the json file and assigns the response data to movieData
async function getInTheatersFromJsonFile() {
    // other way to write promise (needs async keyword). 
    const response = await fetch("./json_files/in_theaters.json");
    const theaterData = await response.json();

    // call the function populateMovies 
    if (window.location.pathname === '/index.html') {
        currentTab = 'index';
        displayRandomElements(theaterData);
        
      } else if (window.location.pathname === '/in_theaters.html') {
        currentTab = 'in_theaters';
        populateTheaterGallery(theaterData);
    }
}

/**
 * populateTheaterGallery takes argument data.
 * it populates in_theaters.html gallery class with data about movies currently in theaters
 * @param {json} data - JSON file
 */
function populateTheaterGallery(data) {
    const section = document.querySelector('.gallery'); // select the sections
    const movies = data.items; 

    // loop through the elements of the movies array, get title and image from JSON to display on webapp
    for (const movie of movies) {
        const movieCard = document.createElement('article'); // create element article that all new elements will be appended to
        const genreList = document.createElement('ul'); // create element list that will contain the genre tags
        // later move to CSS
        genreList.style.padding = "0px";
        genreList.style.width = "130px";
        genreList.style.margin = "0px";

        // cover poster of the movie
        const movImg = document.createElement('img');
        movImg.src = movie.image;
        // later move to CSS
        movImg.style.width = "130px";
        movImg.style.height = "auto";
        movImg.style["margin-top"] = "0px";
        movieCard.appendChild(movImg);

        // movie title
        const movTitle = document.createElement('p'); // creates new element
        movTitle.textContent = `${movie.title}`; // fill the p element with the title
        // later move to CSS
        movTitle.style.width = "130px";
        movTitle.style.height = "50px";
        movTitle.style["text-align"] = "center";
        movTitle.style["font-size"] = "12px";
        movTitle.style["margin-top"] = "2px";
        movTitle.style["margin-bottom"] = "0px";
        movieCard.appendChild(movTitle);

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
            // movGenre.style.width = "60px";
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


// /** testing getWatched function of trakt api */
// function getWatched() {
//     var request = new XMLHttpRequest();
//     request.open('GET', `https://api.trakt.tv/users/${username}/watched/movies`);

//     request.setRequestHeader('Content-Type', 'application/json');
//     request.setRequestHeader('trakt-api-version', '2');
//     request.setRequestHeader('Authorization', `Bearer ${token2}`);
//     request.setRequestHeader('trakt-api-version', '2');
//     request.setRequestHeader('trakt-api-key', clientId);

//     request.onreadystatechange = function () {
//         if (this.readyState === 4) {
//             console.log('Status:', this.status);
//             console.log('Headers:', this.getAllResponseHeaders());
//             console.log('Body:', this.responseText);
//             var watched = JSON.parse(this.responseText)

//         // for every movie in watched list, get more data from IMDB
//         for (const movie of watched) {
//             imdbId = movie.movie.ids.imdb
//             getMovData(imdbId)
//         }
//     }
//   };
//   populateWatchedGallery();

//   request.send();
// }

/** testing getWatched function of trakt api */


function getWatched() {
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
                if((numRequestsCompleted === watched.length) && (window.location.pathname == "/movie-webapp/watched.html")) {
                    populateWatchedGallery();
                }
            });
        } 
    })
    .catch(error => console.error('Error:', error));
}

/** get movie or series data from imdb api*/
function getMovData(imdbId, callback) {
    console.log("2. in GetMovData")

    // check if the function has already been called before
    if (watchedArr.length > 0) {
        callback();
        console.log("was already filled")
    } else {
        var url = `https://www.omdbapi.com/?apikey=${omdbApiKey}&i=${imdbId}`
        fetch(url)
        .then(response => response.json())
        .then(data => {watchedArr.push(data); callback()});
    }
}


function populateWatchedGallery() {
    console.log("3. in populateWatchedGallery")
    console.log(watchedArr)

    for (const watchedMov of watchedArr) { 

        const section = document.querySelector('.gallery'); // select the sections
        const movieCard = document.createElement('article'); // create element article that all new elements will be appended to
        const genreList = document.createElement('ul'); // create element list that will contain the genre tags
            // later move to CSS
            genreList.style.padding = "0px";
            genreList.style.width = "130px";
            genreList.style.margin = "0px";

        // cover poster of the movie
        const movImg = document.createElement('img');
        movImg.src = watchedMov.Poster;
            // later move to CSS
            movImg.style.width = "130px";
            movImg.style.height = "auto";
            movImg.style["margin-top"] = "0px";
            movieCard.appendChild(movImg);

        // movie title
            const movTitle = document.createElement('p'); // creates new element
            movTitle.textContent = `${watchedMov.Title}`; // fill the p element with the title
            // later move to CSS
            movTitle.style.width = "130px";
            movTitle.style.height = "50px";
            movTitle.style["text-align"] = "center";
            movTitle.style["font-size"] = "12px";
            movTitle.style["margin-top"] = "2px";
            movTitle.style["margin-bottom"] = "0px";
            movieCard.appendChild(movTitle);

        // genres
            var genres = watchedMov.Genre
            const genreArr = genres.split(", ");

            for (const genre of genreArr) {
                const movGenre = document.createElement('li'); // creates new element
                movGenre.textContent = genre;

                // get color mapping from genreColors class
                const genreColor = genreColors[genre];
                // later move to CSS
                movGenre.style["background-color"] = genreColor;
                movGenre.style["border-radius"] = "10px";
                movGenre.style["font-size"] = "8px";
                // movGenre.style.width = "60px";
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

/**
 * populateTheaterGallery takes argument data.
 * it populates in_theaters.html gallery class with data about movies currently in theaters
 * @param {json} data - JSON file
 */

function displayRandomElements(data) {
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

    // call function getyoutube
    getyoutube(randomElement)

    for (let i = 0; i < randomElements.length; i++) {
      const id = randomElements[i];
      const title = data.items.find(x => x.id === id).title;
      const ranking = data.items.find(x => x.id === id).imDbRating;
      const plot = data.items.find(x => x.id === id).plot;

      const elementTitle = document.getElementById(`element_${i + 1}_title`);
      elementTitle.textContent = title;

      const elementPlot = document.getElementById(`element_${i + 1}_plot`);
      elementPlot.textContent = plot;

      const elementRanking = document.getElementById(`element_${i + 1}_ranking`);
      elementRanking.textContent = ranking;



    }

    
}


async function getyoutube(id) {
    let movie_id = id
    let url = `https://imdb-api.com/en/API/YouTubeTrailer/k_pius00o6/${movie_id}`;
    const response = await fetch(url);
    var trailer = await response.json();
    console.log(trailer);

    let trailer_link = document.getElementById("trailer_url");
    trailer_link.setAttribute('src', trailer.videoUrl);
    console.log(trailer)
    let trailer_title = document.getElementById("trailer_title");
    trailer_title.innerHTML = `${trailer.title}`;

    let trailer_year = document.getElementById("trailer_year");
    trailer_year.innerHTML = trailer.year;
}


function getUserStats() {
    // let clientId = traktapi.clientId

    let url = `https://api.trakt.tv/users/${username}/stats`;
    
    fetch(url, {
        method: 'GET',
        // mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'trakt-api-version': '2',
            'trakt-api-key': clientId //,
            // 'authorization': `Bearer ${token2}`
//            'access-control-allow-origin': '*'
        }
    })
    .then(response => {
        console.log('Status:', response.status);
        console.log('Headers:', response.headers);
        return response.json(); // response.text()
    })
    .then(body => {
        console.log('Body:', body);
        displayUserStats(body);
    })
    // .catch(error => {
    //     console.error('Error:', error);
    // });

}

function displayUserStats(stats) {
    let minMovies = convertMinutes(stats.movies.minutes);
    let minShows = convertMinutes(stats.episodes.minutes);
    
    const section = document.querySelector('#stats')
    const pMinMovies = document.createElement('p'); // creates new element
    const pMinShows = document.createElement('p'); // creates new element
    pMinMovies.textContent = `Movies: ${minMovies}`; // fill the p element with the title
    pMinShows.textContent = `TV Shows: ${minShows}`; // fill the p element with the title

    section.appendChild(pMinMovies);
    section.appendChild(pMinShows);

}

function convertMinutes(min) {
    var days = Math.floor(min / 1440);
    var hours = Math.floor((min % 1440) / 60);
    var minutes = min % 60;
    return days + " days, " + hours + " hours, " + minutes + " minutes"
}

// window.addEventListener('load', getUserStats)

let genres = []
async function getWatchedFromJsonFile() {
    // other way to write promise (needs async keyword). 
    const response = await fetch("./json_files/watched.json");
    const movieData = await response.json();

    // call the function populateMovies 
    console.log(movieData.items);
    for (const movie of movieData.items) {
        var genres = movie.Genre
        const genreArr = genres.split(", ");

        for (let genre of genreArr) {
            // console.log(genre)
        }
    }

    for (const movie of movieData.items) {
        let year = movie.Year
        if(year in yearCount) {
            yearCount[year] += 1;
        } else {
            yearCount[year] = 1;
        }
       
    }
    console.log(yearCount)

    createYearStats();
    //createGenreStats();
}

function createGenreStats() {

    var canvasElement = document.getElementById("genres");
    var config = {
        type: "bar",
        data: {labels: ["Hello", "Bye"], datasets: [{label: "number", data: [1, 2] }]}
    }

    var genreChart = new Chart(canvasElement, config)

}

let yearCount = {}

function createYearStats() {
    var canvasElement = document.getElementById("genres");
    var config = {
        type: "bar",
        data: {labels: ["Hello", "Bye"], datasets: [{label: "number", data: [1, 2] }]}
    }

    var genreChart = new Chart(canvasElement, config)

}