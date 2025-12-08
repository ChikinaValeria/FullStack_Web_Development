import express from "express";
//access to .env
import dotenv from "dotenv";
dotenv.config();


import movieRouter from "./routes/movie.js";
import { initDatabase } from "./config/dbConfig.js";
//import authenticationRouter from "./routes/authentication.js"

const port = process.env.PORT;
//init the database
await initDatabase()

const app = express()
app.use(express.json())
app.use('/movies', movieRouter )
app.use((req, res) => {
  res.status(404).send("Oops. Not found!");
});


//start the server
app.listen( port, () => {
    console.log("Server listening on http://localhost:3000")
})



