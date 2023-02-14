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
    // Fantasy
    // "Film Noir"
    // History	
    Horror: "#556B2F50", // dark olive green
    // Music
    // Musical
    // Mystery
    Romance: "rgba(255, 0, 0, 0.2)", //semi-transparent red
    // Sci-Fi	
    // "Short Film"
    // Sport
    // Superhero
    // Thriller
    // War
    // Western: "#DEB88750" // semi-transparent burly wood
};

// index.html, top250.json
// later implement API calls, get the API keys from config file (not uploaded, configured in .gitignore)
var mykey = config.MY_KEY;
var url = "https://www.whatever.com/?query&sig=" + mykey;

async function getMoviesFromJsonFile() {
    // other way to write promise (needs async keyword). Gets the top250 movies from the json file and assigns the response data to movieData
    const response = await fetch("json_files/top250.json");
    const movieData = await response.json();
    
    // call the function populateMovies 
    populateMovies(movieData);
}

function populateMovies(data) {
    console.log(data);
    const section = document.querySelector('#top250'); // select the sections
    const movies = data.items; 
    console.log(movies);

    // loop through the elements of the movies array, get title and image from JSON to display on webapp
    for (const movie of movies) {
        const movieCard = document.createElement('article');

        const movTitle = document.createElement('p'); // creates new element
        movTitle.textContent = `${movie.rank}. ${movie.title}`; // fill the p element with the title

        const movImg = document.createElement('img');
        movImg.src = movie.image;
        movImg.style.width = "100px";
        movImg.style.height = "auto";

        movieCard.appendChild(movTitle);
        movieCard.appendChild(movImg);
        
        section.appendChild(movieCard);

        // append the element to the section

    }
}

// in_theaters.html, in_theaters.json
async function getInTheatersFromJsonFile() {
    // other way to write promise (needs async keyword). Gets the movies in theaters from the json file and assigns the response data to movieData
    const response = await fetch("json_files/in_theaters.json");
    const theaterData = await response.json();
    console.log("called Theater func");
    // call the function populateMovies 
    populateTheaterGallery(theaterData);
}

function populateTheaterGallery(data) {
    console.log(data);
    const section = document.querySelector('.gallery'); // select the sections
    const movies = data.items; 
    console.log(movies);

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
            

            genreList.appendChild(movGenre);            

            // console.log(genreColors.genreName)
            
            // const movGenre = document.createElement('p');
            // movGenre.textContent = genre.key;
        }

        
        // movieCard.appendChild(movGenre);
        movieCard.appendChild(genreList);

        section.appendChild(movieCard);

        // append the element to the section

    }
}



// Action (Blue)
// Adventure (Green)
// Comedy (Yellow)
// Crime & Gangster (Purple)
// Drama (Red)
// Historical (Gold)
// Horror (DarkGreen)
// Musicals (Orange)
// Sci-Fi (Silver)
// War (Grey)
// Western (Brown)