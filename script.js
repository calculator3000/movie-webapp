var imdbApiKey = imdbapi.key3
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
        const movie_card = document.createElement('article');

        const movie_title = document.createElement('p'); // creates new element
        movie_title.innerHTML = `${movie.rank}. ${movie.title}`; // fill the p element with the title
        // let movie_title = document.getElementById("temperature");
        // movie_title.textContent = `${movie.rank}. ${movie.title}`;

        const movie_image = document.createElement('img');
        movie_image.src = movie.image;
        movie_image.style.width = "100px";
        movie_image.style.height = "auto";

        movie_card.appendChild(movie_title);
        movie_card.appendChild(movie_image);
        
        section.appendChild(movie_card);

        // append the element to the section

    }
}

// ********** in_theaters.html, in_theaters.json **********
// Gets the movies in theaters from the json file and assigns the response data to movieData
async function getInTheatersFromJsonFile() {
    // other way to write promise (needs async keyword). 
    const response = await fetch("json_files/in_theaters.json");
    const theaterData = await response.json();

    // call the function populateMovies 
    // populateTheaterGallery(theaterData);
    displayRandomElements(theaterData);
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


/** testing getWatched function of trakt api */
function getWatched() {
    var request = new XMLHttpRequest();
    request.open('GET', `https://api.trakt.tv/users/${username}/watched/movies`);

    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('trakt-api-version', '2');
    request.setRequestHeader('Authorization', `Bearer ${token2}`);
    request.setRequestHeader('trakt-api-version', '2');
    request.setRequestHeader('trakt-api-key', clientId);

  
    request.onreadystatechange = function () {
        if (this.readyState === 4) {
            console.log('Status:', this.status);
            console.log('Headers:', this.getAllResponseHeaders());
            console.log('Body:', this.responseText);
            var watched = JSON.parse(this.responseText)

        // for every movie in watched list, get more data from IMDB
        for (const movie of watched) {
            imdbId = movie.movie.ids.imdb
            getMovData(imdbId)
        }
    }
  };
  request.send();
        
  populateWatchedGallery();
}

/** get movie or series data from imdb api*/
function getMovData(imdbId) {
    url = `https://imdb-api.com/en/API/Title/${imdbApiKey}/${imdbId}/FullActor,FullCast,Posters,Images,Ratings,`
    
    fetch(url)
    .then(response => response.json())
    .then(data => {watchedArr.push(data)}); // save the response in watchedArr
}

function populateWatchedGallery() {
    console.log("in this function finally")
    console.log(watchedArr)
    const section = document.querySelector('.watched-gallery'); // select the sections
    const movies = watchedArr; 
    
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

/** program to get a random item from an array */

/**
 * populateTheaterGallery takes argument data.
 * it populates in_theaters.html gallery class with data about movies currently in theaters
 * @param {json} data - JSON file
 */

function displayRandomElements(data) {
    // Define a list of elements
    // Extract the IDs from the JSON and store them in an array
    console.log(data);
    const elements = data.items.map(user => user.id);

    
    const randomElements = [];
    while (randomElements.length < 4) {
      const randomIndex = Math.floor(Math.random() * elements.length);
      const randomElement = elements[randomIndex];
      if (!randomElements.includes(randomElement)) {
        randomElements.push(randomElement);
      }
    }

    const arr_title = [];
    const arr_ranking = [];
    const arr_plot = [];

    for (var i = 0; i < randomElements.length; i++) {
        console.log(randomElements[i]);
        var id = randomElements[i];
        title = data.items.find(x => x.id === randomElements[i]).title;
        arr_title.push(title)
        ranking = data.items.find(y => y.id === randomElements[i]).imDbRating;
        arr_ranking.push(ranking);
        plot = data.items.find(z => z.id === randomElements[i]).plot;
        arr_plot.push(plot);

      }

    
    // create html element for each title, rank and plot for the four random movies
    const first_title = document.getElementById("first_title");
    first_title.textContent = arr_title[0];
    const second_title = document.getElementById("second_title");
    second_title.textContent = arr_title[1];
    const third_title = document.getElementById("third_title");
    third_title.textContent = arr_title[2];
    const fourth_title = document.getElementById("fourth_title");
    fourth_title.textContent = arr_title[3];

    /*
    const first_ranking = document.getElementById("first_ranking");
    first_ranking.textContent = arr_ranking[0];
    const second_ranking = document.getElementById("second_ranking");
    second_ranking.textContent = arr_ranking[1];
    const third_ranking = document.getElementById("third_ranking");
    third_ranking.textContent = arr_ranking[2];
    const fourth_ranking = document.getElementById("fourth_ranking");
    fourth_ranking.textContent = arr_ranking[3];
    */

    const first_plot = document.getElementById("first_plot");
    first_plot.textContent = arr_plot[0];
    const second_plot = document.getElementById("second_plot");
    second_plot.textContent = arr_plot[1];
    const third_plot = document.getElementById("third_plot");
    third_plot.textContent = arr_plot[2];
    const fourth_plot = document.getElementById("fourth_plot");
    fourth_plot.textContent = arr_plot[3];


    // Generate a random index within the range of the array's length
    const randomIndex = Math.floor(Math.random() * elements.length);

    // Access the element at the random index
    const randomElement = elements[randomIndex];
    console.log(randomElement)

    getyoutube(randomElement)
     
  }

  async function getyoutube(id) {
    let movie_id = id
    let url = `https://imdb-api.com/en/API/YouTubeTrailer/k_s6o9v1tp/${movie_id}`;
    const response = await fetch(url);
    var trailer = await response.json();
    console.log(trailer);
  
    let modal_title = document.getElementById("modal_title");
    modal_title.innerHTML = `${datawiki.fullTitle}`;
  
    let modal_content = document.getElementById("modal_content");
    modal_content.innerHTML = datawiki.plotShort.plainText;
}
