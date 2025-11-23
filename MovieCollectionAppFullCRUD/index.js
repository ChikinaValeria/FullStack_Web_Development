const express = require('express')
const morgan = require('morgan')

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(morgan('dev'));

const movies = [
    { id: 1, title: "Inception", director: "Christopher Nolan", year: 2010 },
    { id: 2, title: "The Matrix", director: "The Wachowskis", year: 1999 },
    { id: 3, title: "Parasite", director: "Bong Joon-ho", year: 2019 }
]


app.get('/', (req, res) =>{
    //res.json(movies)
    let htmlList = '<h1>Movie Collection</h1><ul>';
    movies.forEach(movie => {
        htmlList += `<li>*${movie.title}* (Director: ${movie.director}, Year: ${movie.year})</li>`;
    });
    htmlList += '</ul>';

    res.setHeader('Content-Type', 'text/html');
    res.send(htmlList);
})


app.get('/movies', (req,res)=> {
    let result = [...movies]   // all movies by default

    const rawTitleQuery = req.query.title;
    if(rawTitleQuery !== undefined){

        const titleString = String(rawTitleQuery).trim().toLowerCase();
            if (titleString === "") {
                return res.status(400).send("Title parameter cannot be empty.");
            }
            result = result.filter( movie => movie.title.toLowerCase() === titleString )
    }

    const rawDirectorQuery = req.query.director;
    if(rawDirectorQuery !== undefined){

        const directorString = String(rawDirectorQuery).trim().toLowerCase();
            if (directorString === "") {
                return res.status(400).send("Director parameter cannot be empty.");
            }
            result = result.filter( movie => movie.director.toLowerCase() === directorString )
    }

    const rawYearQuery = req.query.year;

    if (rawYearQuery !== undefined) {

            const yearString = String(rawYearQuery).trim();
            if (yearString === "") {
                return res.status(400).send("Year parameter cannot be empty.");
            }

            const year = parseInt(yearString);

            if(isNaN(year)){
                return res.status(400).send("Invalid year in the query parameter")
            }
            result = result.filter( movie => movie.year === year)
    }
    console.log("Returning filtered movies")
    res.json(result)
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
    const error = validateMovieData(req.body)
    if(error){
        return res.status(400).send(error);
    }

    const {title, director, year} = req.body;
    const newMovie = {
        id: generateNextId(),
        title,
        director,
        year
    };
    movies.push(newMovie)
    res.status(201).json(newMovie)

    console.log(newMovie)
    console.log('Current movie list:', movies);

})

function generateNextId(){
    if(movies.length === 0) return 1;
    return Math.max(...movies.map(movie => movie.id))+1
}

function validateMovieData(movie){
    const title = movie.title
    const year = movie.year
    const director = movie.director

    //const {title, director, year} = movie

    if(!title || typeof title !== 'string') return "Invalid or missing 'title'"
    if( year === undefined || typeof year !== 'number' || year < 1888 ) return "Invalid or missing 'year'"
    if( !director || typeof director !== 'string') return "Invalid or missing 'director'";

    return null
}

app.patch('/movies/:id', (req, res)=>{
    const id = parseInt(req.params.id);
    // First verify that the id is an integer
    if(isNaN(id))
        return res.status(400).send("Invalid movie ID")

    const index = movies.findIndex( movie => movie.id === id);
    if( index === -1 ){
        return res.status(404).send("No movie with that ID found")
    }

    const updatedMovie = { ...movies[index], ...req.body }
    // Let's validate the updated movie data
    const error = validateMovieData(updatedMovie)
    if( error ){
        return res.status(400).send(error)
    }

    movies[index] = updatedMovie
    res.json(updatedMovie) // 200 OK
})


// Delete movie by id
app.delete('/movies/:id', (req, res ) => {
    const id = parseInt(req.params.id)
    if(isNaN(id))
        return res.status(400).send("Invalid movie ID")

    const index = movies.findIndex(s => s.id === id)

    if( index === -1) {
        return res.status(404).send("No movie with that ID found")
    }
    movies.splice(index, 1)
    res.status(204).end()

})

app.use((req,res)=> {
res.status(404).send('Oops. Not found!')
})

//start the server
app.listen(PORT, () => {
    console.log('My Node Express server is running!')
})
