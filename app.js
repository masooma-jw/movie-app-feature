const apiKey = "2a5a6176cf791a73a44fd3b2855a512a";
const imageBaseUrl = "https://image.tmdb.org/t/p/w500";

let popularMovies = [];

async function fetchTop3() {
  let apiUrl = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const carouselInner = document.querySelector(".carousel-inner");
      carouselInner.innerHTML = "";

      const top3Movies = data.results.slice(0, 3);
      top3Movies.forEach((movie, index) => {
        const carouselItem = document.createElement("div");
        carouselItem.classList.add("carousel-item");

        if (index === 0) {
          carouselItem.classList.add("active");
        }

        carouselItem.addEventListener("click", () => {
          window.location.href = `movie.html?id=${movie.id}`;
        });

        const movieImage = document.createElement("img");
        movieImage.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        movieImage.alt = movie.title;

        carouselItem.style.background = `linear-gradient(rgba(0,0,0,0.9),rgba(40,9,30,0.9)),url(https://image.tmdb.org/t/p/w500${movie.poster_path}`;

        carouselItem.appendChild(movieImage);
        carouselInner.appendChild(carouselItem);
      });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchTop3();

function createMovieCard(movie) {
  const movieCard = document.createElement("div");
  movieCard.classList.add(
    "col-lg-2",
    "col-md-3",
    "col-sm-3",
    "mb-4",
    "movie-card"
  );

  movieCard.addEventListener("click", () => {
    window.location.href = `movie.html?id=${movie.id}`;
  });
  movieCard.dataset.movieId = movie.id;

  const movieImage = document.createElement("img");
  movieImage.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  movieImage.alt = movie.title;
  movieImage.classList.add("img-fluid");
  movieImage.loading="lazy";

  const movieTitle = document.createElement("h5");
  movieTitle.classList.add("mt-3");
  movieTitle.textContent = movie.title;
  const movieRate = document.createElement('div')
  movieRate.style.color = 'rgb(221, 143, 215)';
  movieRate.innerHTML = `<h6>IMDB Rating: ${movie.vote_average}`;

  movieCard.appendChild(movieImage);
  movieCard.appendChild(movieTitle);
  movieCard.append(movieRate);
  

  return movieCard;
}



const popularMoviesSection = document.getElementById("popularMovies");

async function fetchPopularMovies() {
  console.log("Fetching popular movies...");
  let url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      popularMovies = data.results;

      popularMoviesSection.innerHTML = "";

      data.results.forEach((movie) => {
        const movieCard = createMovieCard(movie);
        popularMoviesSection.appendChild(movieCard);
      });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  
}



fetchPopularMovies();



async function fetchMovieDetails(movieId) {
  const url = `${apiUrl}/movie/${movieId}?api_key=${apiKey}&append_to_response=credits`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}

const searchResultsDiv = document.getElementById("searchResults");
document.getElementById('searchSection').style.display = "none";

async function searchMovies() {
  const searchQuery = document.getElementById("searchInput").value;
  const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
    searchQuery
  )}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      searchResultsDiv.innerHTML = "";
      document.getElementById("popularSection").style.display = "none";
      document.getElementById('searchSection').style.display = "block";
      data.results.forEach((movie) => {
        const movieCard = createMovieCard(movie);
        searchResultsDiv.appendChild(movieCard);
      });
    } else {
      const searchResultsDiv = document.getElementById("searchResults");
      searchResultsDiv.innerHTML = "<p>No results found.</p>";
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function displayPopularMovies() {
  document.getElementById("popularSection").style.display = "block";
  document.getElementById('searchSection').style.display = "none";
}

document.getElementById("searchInput").addEventListener("input", (event) => {
  const searchQuery = event.target.value.trim();
  if (searchQuery === "") {
    displayPopularMovies();
  } else {
    searchMovies();
  }

});

