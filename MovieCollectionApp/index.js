const express = require('express')

const app = express();
const PORT = 3000;

app.use(express.json());

const movies = [
    { id: 1, title: "Inception", director: "Christopher Nolan", year: 2010 },
    { id: 2, title: "The Matrix", director: "The Wachowskis", year: 1999 },
    { id: 3, title: "Parasite", director: "Bong Joon-ho", year: 2019 }
]

app.get('/', (req, res) => {
    res.send('Hello from my Express app!')
})

app.get('/movies', (req, res) =>{
    //res.json(movies)
    let htmlList = '<h1>Movie Collection</h1><ul>';
    movies.forEach(movie => {
        htmlList += `<li>*${movie.title}* (Director: ${movie.director}, Year: ${movie.year})</li>`;
    });
    htmlList += '</ul>';

    res.setHeader('Content-Type', 'text/html');
    res.send(htmlList);
})

app.get('/movies/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const movie = movies.find(movie => movie.id == id)
    if(movie){
        res.json(movie);
    }else{
        res.status(404).json({message: 'Movie with this id is not found'})
    }
})

app.post('/movies', (req, res) => {
    const newMovie =req.body;
    if(!newMovie.id || !newMovie.title || !newMovie.director || !newMovie.year === undefined){
        return res.status(400).json({message: 'Missing or bad movie data'})
    }
    movies.push(newMovie)
    console.log(newMovie)
    console.log('Текущий список фильмов:', movies);
    //return created status and created data
    return res.status(201).json(newMovie)
})

//start the server
app.listen(PORT, () => {
    console.log('My Node Express server is running!')
})