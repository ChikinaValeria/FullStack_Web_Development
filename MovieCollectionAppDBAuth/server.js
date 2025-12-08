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
