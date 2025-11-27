// This is needed for the access to .env
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { MongoClient } from "mongodb";

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
    res.send("Server is alive!");
});

// Read the environment values from .env
const uri = process.env.MONGODB_URI;
if(!uri){
    console.error("Problem with uri");
    process.exit(1);
}
const dbName = process.env.MONGODB_NAME;
const port = process.env.PORT;

// Connect the MongoDB Cluster (remember that this IP should be in the allowed IPs list)
const client = new MongoClient(uri)

// Let's create some sample data (initial students)
const initialMovies = [
    { id: 1, title: "Inception", director: "Christopher Nolan", year: 2010 },
    { id: 2, title: "The Matrix", director: "The Wachowskis", year: 1999 },
    { id: 3, title: "Parasite", director: "Bong Joon-ho", year: 2019 }
];

let movieCollection;

// Let's create a function to connect to Mongo and seed data if collection is empty
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

// First we init the database (connect and if needed, create some seed movies)
await initDatabase()

// Then we can start the server
app.listen( port, () => {
    console.log("Server listening on http://localhost:3000")
})

// Let's implement a simple GET method GET /movies

// DB connection is over the cloud so every operation is basically async
app.get("/movies", async (req, res)=> {
    try {
        // Get all movies from the database. Find with only {} finds with no filters
        let result = await movieCollection.find({}).toArray();

        if(req.query.title){
            const title = req.query.title.toLowerCase()
            result = result.filter( movie => movie.title.toLowerCase() === title )
         }

        if( req.query.year){
            const requestedYear = parseInt(req.query.year);

            if(isNaN(requestedYear)){
                return res.status(400).send("Invalid 'year' parameter. Must be a number.");
            }
            result = result.filter( movie => movie.year === requestedYear );
        }

        if( req.query.director){
            const director = req.query.director.toLowerCase()
            result = result.filter( movie => movie.director.toLowerCase() === director )
        }
        res.json(result);
    }
    catch( err ){
        console.log( "GET / movies error: ", err)
        res.status(500).json({error: "Internal server error. Some problem with the database."})
    }
});

// add some basic crud operations with MongoDB
app.get('/movies/:id', async (req,res)=>{

    try {
        // Find the movie with the given id and return if found
        const id = parseInt(req.params.id)
        // Get the student from the Mongo DB
        const movie = await movieCollection.findOne({id});
        if( movie ){
            res.json(movie); // 200 OK
        }
        else{
            res.status(404).json({message: 'Movie with that id not found'});
        }
    } catch (error){
        res.status(500).send("Internal server error with DB connection: ", err)
    }
});
/*
// Post /students -> add new student. When posting, we need to validate the data (e.g. unique id, legal name and positive credit points etc.)
app.post('/students', async (req, res)=> {

    try {
        // validate the student through a validation function (validates the data)
        const error = validateStudentData(req.body)
        if(error ){
            return res.status(400).send(error); // invalid data
        }

        // Ok. We can proceed with creating a new student
        const {name, age, creditPoints, campus} = req.body
        const newStudent = {
            id: await generateNextId(),
            name,
            age,
            campus,
            creditPoints // todo: generate a new one
        };

        // Add the new student to MongoDB
        const result = await studentCollection.insertOne( newStudent )

        res.status(201).json(newStudent)
    } catch (err){
        console.error("Error inserting student:", err);
        res.status(500).send("Internal server error with POST/ students")
    }
    // Test this with .rest client etc -> the new student shoud appear in MongoDB

});


// Update a student data (student with a specific id)
app.put('/students/:id', async (req, res)=>{
    try {
        const id = parseInt(req.params.id);
        // First verify that the id is an integer
        if(isNaN(id))
            return res.status(400).send("Invalid student ID")

        // Let's find the student with that ID. If not found, return 404
        const existing = await studentCollection.findOne({id});
        if(!existing){
            return res.status(404).send("No student with that ID found")
        }



        // The student with that id found -> we can proceed with updating but we have to validate :)
        const updatedStudent = { ...existing, ...req.body }

        // Let's validate the updated student data
        const error = validateStudentData(updatedStudent)
        if( error ){
            return res.status(400).send(error)
        }

        // We don't want to update the _id in the mongo db so delete the _id fro the updatedStudent
        delete updatedStudent._id // delete the field

        // Update the student in the mongoDB
        await studentCollection.updateOne({id}, { $set: updatedStudent });
        // $set == "Modify only these fields in the document - leave rest untouched in the database"


        res.json(updatedStudent) // 200 OK
    } catch (err ){
        console.error("Error inserting student:", err);
        res.status(500).send("Internal server error with PUT /student:id")
    }

})

// Delete student by id
app.delete('/students/:id', async (req, res ) => {
    try {
        const id = parseInt(req.params.id)
        if(isNaN(id))
            return res.status(400).send("Invalid student ID")

        const result = await studentCollection.deleteOne({id});

        if( result.deletedCount === 0 ){
            return res.status(404).send("No student with that ID found. Nothing deleted")
        }

        res.status(204).end()
    }catch (err){
        res.status(500).send("Internal server error with DELETE /student:id")
    }
})
    */

// 404 fallback
app.use((req, res) => {
  res.status(404).send("Oops. Not found!");
});


/*
async function generateNextId() {
    // 1. Находим студента с максимальным id
    const maxIdStudent = await studentCollection.findOne(
        {}, // Фильтр: без фильтрации, ищем по всей коллекции
        {
            sort: { id: -1 }, // Сортируем по полю 'id' в порядке убывания (от большего к меньшему)
            projection: { id: 1, _id: 0 } // Включаем только поля 'id' и исключаем '_id'
        }
    );

    // 2. Если коллекция пуста, начинаем с 1. Иначе берем max ID и добавляем 1.
    if (!maxIdStudent) {
        return 1;
    } else {
        return maxIdStudent.id + 1;
    }
}

// Our data validation helper function in JavaScript
function validateStudentData(student){
    // Destruct the student object properties (check ES6+ object destruct)
    // Modern way ES 6+ object destruct in one row
    const {name, age, creditPoints, campus} = student

    if(!name || typeof name !== 'string') return "Invalid or missing 'name'"
    if( age === undefined || typeof age !== 'number' || age < 0 ) return "Invalid or missing 'age'"
    if( !campus || !validCampuses.includes( campus )) return "Invalid or missing 'campus'";
    // Todo: more rules if needed

    return null // the data is valid :)

}
*/