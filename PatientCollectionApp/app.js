// app.js
import express from "express";
import dotenv from "dotenv";
dotenv.config();

import patientRouter from "./routes/patient.js";
import { initDatabase } from "./config/dbConfig.js";
import authenticationRouter from "./routes/authentication.js"

const port = process.env.PORT;

await initDatabase()

const app = express()
app.use(express.json())
app.use('/patient', patientRouter )
app.use('/auth', authenticationRouter)
app.use((req, res) => {
  res.status(404).send("Oops. Not found!");
});

app.listen( port, () => {
    console.log("Server listening on http://localhost:3000")
})