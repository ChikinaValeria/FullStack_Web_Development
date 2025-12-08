import { getMovieCollection } from "../config/dbConfig.js";
import {generateNextId} from "../utils/movieUtils.js";

export const getAllMovies = async (req, res)=> {
    try {
        // Get all movies from the database. Find with only {} finds with no filters
        let result = await getMovieCollection().find({}).toArray();

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
};


export const getMovieById = async (req,res)=>{

    try {
        // Find the movie with the given id and return if found
        const id = parseInt(req.params.id)
        // Get the movie from the Mongo DB
        const movie = await getMovieCollection().findOne({id});
        if( movie ){
            res.json(movie); // 200 OK
        }
        else{
            res.status(404).json({message: 'Movie with that id not found'});
        }
    } catch (error){
        res.status(500).send("Internal server error with DB connection: ", err)
    }
};

export const createMovie = async (req, res)=> {
    try {
        const {title, director, year} = req.body
        const newMovie = {
            id: await generateNextId(),
            title,
            director,
            year
        };

        // Add the new movie to MongoDB
        const result = await getMovieCollection().insertOne( newMovie )

        res.status(201).json(newMovie)
    } catch (err){
        console.error("Error inserting movie:", err);
        res.status(500).send("Internal server error with POST/ movie")
    }


};

export const updateMovie = async (req, res)=>{
    try {
        const id = parseInt(req.params.id);
        //verify that the id is an integer
        if(isNaN(id))
            return res.status(400).send("Invalid movie ID")

        // find the movie with that ID
        const existing = await getMovieCollection().findOne({id});
        if(!existing){
            return res.status(404).send("No movie with that ID found")
        }

        // The movie with that id found -> we can proceed with updating but we have to validate :)
        const updatedMovie = { ...existing, ...req.body }

        // We don't want to update the _id in the mongo db so delete the _id from the updatedMovie
        delete updatedMovie._id // delete the field

        // Update the movie in the mongoDB
        await getMovieCollection().updateOne({id}, { $set: updatedMovie });
        // $set == "Modify only these fields in the document - leave rest untouched in the database"


        res.json(updatedMovie) // 200 OK
    } catch (err ){
        console.error("Error inserting movie:", err);
        res.status(500).send("Internal server error with PUT /movie:id")
    }

};

export const deleteMovie  = async (req, res ) => {
    try {
        const id = parseInt(req.params.id)
        if(isNaN(id))
            return res.status(400).send("Invalid movie ID")

        const result = await getMovieCollection().deleteOne({id});

        if( result.deletedCount === 0 ){
            return res.status(404).send("No movie with that ID found. Nothing deleted")
        }

        res.status(204).end()
    }catch (err){
        res.status(500).send("Internal server error with DELETE /movie:id")
    }
}

