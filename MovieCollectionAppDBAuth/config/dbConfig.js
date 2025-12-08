import { MongoClient } from 'mongodb'

let client; // new
let db;
let movieCollection;

const initialMovies = [
    { id: 1, title: "Inception", director: "Christopher Nolan", year: 2010 },
    { id: 2, title: "The Matrix", director: "The Wachowskis", year: 1999 },
    { id: 3, title: "Parasite", director: "Bong Joon-ho", year: 2019 }
];

export const initDatabase = async () => {

    const uri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_NAME;

    if(!uri){
        console.error("Problem with uri: MONGODB_URI is undefined.");
        process.exit(1);
    }

    try {
        client = new MongoClient(uri); //new
        await client.connect();
        console.log("Connected to MongoDB");

        db = client.db(dbName) // deleted const
        movieCollection = db.collection("movies");

        const count = await movieCollection.countDocuments();
        if( count === 0 ){
            const result = await movieCollection.insertMany(initialMovies);
            console.log("Some initial movies created")
        }
        else {
            console.log("The DB already had some movies.")
        }
    } catch (err){
        console.error("MongoDB connection or init failed:",  err)
        throw err;
    }
}

// Export methods to access the db configured and connected here
export const getDb = () => db;
export const getMovieCollection = () => movieCollection;