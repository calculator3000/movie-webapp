function getMovies() {
    console.log("Hello")
    //let key="k_pius00o6"
    // let url = `https://imdb-api.com/en/API/Top250Movies/${key}`;

    fetch(url)
    .then(response => response.json())
    .then(data => console.log(data));

    // .then(data => {
    //     const list = data.d;
    //     list.map((item) => {
    //         console.log(item)
    //         const name = item.l;
    //         const poster = item.i.imageUrl
                
    //     })
    // })
}

// function getMoviesFromJsonFile() {
//     fetch("top250.json")
//     .then(Response => Response.json())
//     .then(data => {
//         console.log(data);
//   		// or whatever you wanna do with the data

//     console.log("Testing to pring first movie:")
//     console.log(data.items[0].title)
//     var movtitleZ = data.items[0].title;
//     var movrank = data.items[0].rank;
//     var name = "Hannah"
//     document.getElementById("movrank").innerHTML = movrank + " " + movtitleZ + name;
//     //document.getElementById("movtitle").innerHTML = movtitle;

//     populateMovies(data)
//     });

// }

function setMovies(data){
    console.log("In set movies")
    console.log(data)
    // var json = JSON.parse(data);
    // console.log(json.items)
    // let movie_title = document.getElementById("title");
}


async function getMoviesFromJsonFile() {
    // other way to write promise (needs async keyword). Gets the top250 movies from the json file and assigns the response data to movieData
    const response = await fetch("top250.json");
    const movieData = await response.json();
    
    // call the function populateMovies 
    populateMovies(movieData);
}

function populateMovies(data) {
    console.log(data);

    const section = document.querySelector('section'); // select the sections
    const movies = data.items; 
    console.log(movies);

    // loop through the elements of the movies array
    for (const movie of movies) {
        console.log(movie.title);

        const myPara1 = document.createElement('p');

    }

}

function populateHeroes(obj) {
    const section = document.querySelector('section');
    const heroes = obj.members;
  
    for (const hero of heroes) {
      const myArticle = document.createElement('article');
      const myH2 = document.createElement('h2');
      const myPara1 = document.createElement('p');
      const myPara2 = document.createElement('p');
      const myPara3 = document.createElement('p');
      const myList = document.createElement('ul');
  
      myH2.textContent = hero.name;
      myPara1.textContent = `Secret identity: ${hero.secretIdentity}`;
      myPara2.textContent = `Age: ${hero.age}`;
      myPara3.textContent = 'Superpowers:';
  
      const superPowers = hero.powers;
      for (const power of superPowers) {
        const listItem = document.createElement('li');
        listItem.textContent = power;
        myList.appendChild(listItem);
      }
  
      myArticle.appendChild(myH2);
      myArticle.appendChild(myPara1);
      myArticle.appendChild(myPara2);
      myArticle.appendChild(myPara3);
      myArticle.appendChild(myList);
  
      section.appendChild(myArticle);
    }
  }