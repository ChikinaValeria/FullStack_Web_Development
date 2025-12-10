import { MongoClient } from 'mongodb'

let client; // new
let db;
let patientCollection;

const initialPatients = [
    { id: 1, name: "Onni Makinen", age: 72, department: "cardiology", diagnosis: "Heart Stroke", accepted: "2025-11-24" },
    { id: 2, name: "Pekka Suolainen", age: 22, department: "dermatology", diagnosis: "Diathesis", accepted: "2025-11-30" },
    { id: 3, name: "Harri Nelonen", age: 38, department: "neurology", diagnosis: "Peripheral Neuropathy", accepted: "2025-12-10" }
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
        patientCollection = db.collection("movies");

        const count = await patientCollection.countDocuments();
        if( count === 0 ){
            const result = await patientCollection.insertMany(initialPatients);
            console.log("Some initial patients created")
        }
        else {
            console.log("The DB already had some patients.")
        }
    } catch (err){
        console.error("MongoDB connection or init failed:",  err)
        throw err;
    }
}

// Export methods to access the db configured and connected here
export const getDb = () => db;
export const getMovieCollection = () => movieCollection;