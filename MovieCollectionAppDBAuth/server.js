//access to .env
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { MongoClient } from "mongodb";

const app = express()
app.use(express.json())

// Read the environment values from .env
const uri = process.env.MONGODB_URI;
if(!uri){
    console.error("Problem with uri");
    process.exit(1);
}
const dbName = process.env.MONGODB_NAME;
const port = process.env.PORT;

// Connect the MongoDB Cluster
const client = new MongoClient(uri)

//sample data (initial movies)
const initialMovies = [
    { id: 1, title: "Inception", director: "Christopher Nolan", year: 2010 },
    { id: 2, title: "The Matrix", director: "The Wachowskis", year: 1999 },
    { id: 3, title: "Parasite", director: "Bong Joon-ho", year: 2019 }
];

let movieCollection;

// function to connect to Mongo and seed data if collection is empty
async function initDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db(dbName) // create database movie_collection
        movieCollection = db.collection("movies");

        // Let's check if there are movies in the database. If not, add the initial movies
        const count = await movieCollection.countDocuments();
        if( count === 0 ){
            // No movies there -> lets create the initial movies there
            const result = await movieCollection.insertMany(initialMovies);
            console.log("Some movies created there")
        }
        else {
            console.log("There were some initial movies already so nothing added. ")
        }
    } catch (err){
        console.error("MongoDB connection or init failed:",  err)
        throw err;
    }

}

//init the database
await initDatabase()

//start the server
app.listen( port, () => {
    console.log("Server listening on http://localhost:3000")
})

// DB connection is over the cloud so every operation is async

// 404 fallback
app.use((req, res) => {
  res.status(404).send("Oops. Not found!");
});

async function generateNextId() {
    // find movie with max id
    const maxIdMovie = await movieCollection.findOne(
        {}, //no filter, searching through entire collection
        {
            sort: { id: -1 }, // sorting by id desc
            projection: { id: 1, _id: 0 } // including id, excluding _id
        }
    );

    // if the collection is empty, start with one, else max+1
    if (!maxIdMovie) {
        return 1;
    } else {
        return maxIdMovie.id + 1;
    }
}


function validateMovieData(movie){
    const {title, director, year} = movie

    if(!title || typeof title !== 'string') return "Invalid or missing 'title'"
    if( year === undefined || typeof year !== 'number' || year < 1888 ) return "Invalid or missing 'year'"
    if( !director || typeof director !== 'string') return "Invalid or missing 'director'";

    return null // the data is valid :)

}
