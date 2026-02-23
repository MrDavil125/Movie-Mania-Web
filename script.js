let moviesDiv = document.getElementById("movies");
let search = document.getElementById("search");

fetch("movies.json")
.then(res => res.json())
.then(data => {

showMovies(data);

search.addEventListener("input", () => {

let value = search.value.toLowerCase();

let filtered = data.filter(movie =>
movie.title.toLowerCase().includes(value)
);

showMovies(filtered);

});

});

function showMovies(data){

moviesDiv.innerHTML = "";

data.forEach(movie => {

moviesDiv.innerHTML += `
<div class="card">
<img src="${movie.poster}">
<h3>${movie.title}</h3>
<a href="${movie.download}">
<button>Download</button>
</a>
</div>
`;

});

}
