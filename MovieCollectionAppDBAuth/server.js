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


