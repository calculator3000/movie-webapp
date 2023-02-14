async function getMoviesFromJsonFile() {
    // other way to write promise (needs async keyword). Gets the top250 movies from the json file and assigns the response data to movieData
    const response = await fetch("top250.json");
    const movieData = await response.json();
    
    // call the function populateMovies 
    populateMovies(movieData);
}


function populateMovies(data) {
    console.log(data);
    const section = document.querySelector('#top250'); // select the sections
    const movies = data.items; 
    console.log(movies);

    // loop through the elements of the movies array
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
