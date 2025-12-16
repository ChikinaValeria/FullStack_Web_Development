import { getPatientCollection } from "../config/dbConfig.js";
import {generateNextId} from "../utils/patientUtils.js";

export const getAllPatients = async (req, res) => {
    try {
        // Object to build the MongoDB query filter
        const filter = {};

        // FILTERING case Insensitive using $regex

        if (req.query.name) {
            // Using $regex with 'i' option for case-insensitive search
            filter.name = { $regex: req.query.name, $options: 'i' };
        }

        if (req.query.department) {
            filter.department = { $regex: req.query.department, $options: 'i' };
        }

        if (req.query.diagnosis) {
            filter.diagnosis = { $regex: req.query.diagnosis, $options: 'i' };
        }

        if (req.query.fromDate || req.query.toDate) {
            filter.accepted = {};

            if (req.query.fromDate) {
                // $gte: Greater Than or Equal
                filter.accepted.$gte = req.query.fromDate;
            }

            if (req.query.toDate) {
                // $lte: Less Than or Equal
                filter.accepted.$lte = req.query.toDate;
            }
        }

        // Execute the MongoDB query using the filter object
        // MongoDB will perform all filtering, which is much faster than in-memory filtering
        let result = await getPatientCollection().find(filter).toArray();

        res.json(result);
    } catch (err) {
        console.log("GET / patients error: ", err);
        res.status(500).json({ error: "Internal server error. Some problem with the database." });
    }
};


export const getPatientById = async (req,res)=>{

    try {
        const id = parseInt(req.params.id)
        const patient = await getPatientCollection().findOne({id});
        if( patient ){
            res.json(patient); // 200 OK
        }
        else{
            res.status(404).json({message: 'Patient with that id not found'});
        }
    } catch (error){
        res.status(500).send("Internal server error with DB connection: ", err)
    }
};

export const createPatient = async (req, res)=> {
    try {
        const {name, age, department, diagnosis, accepted} = req.body
        const newPatient = {
            id: await generateNextId(),
            name,
            age,
            department,
            diagnosis,
            accepted
        };


        const result = await getPatientCollection().insertOne( newPatient )

        res.status(201).json(newPatient)
    } catch (err){
        console.error("Error inserting patient:", err);
        res.status(500).send("Internal server error with POST/ patient")
    }


};

export const updatePatient = async (req, res)=>{
    try {
        const id = parseInt(req.params.id);
        //verify that the id is an integer
        if(isNaN(id))
            return res.status(400).send("Invalid patient ID")

        const existing = await getPatientCollection().findOne({id});
        if(!existing){
            return res.status(404).send("No patient with that ID found")
        }

        const updatedPatient = { ...existing, ...req.body }

        delete updatedPatient._id // delete the field

        await getPatientCollection().updateOne({id}, { $set: updatedPatient });
        // $set == "Modify only these fields in the document - leave rest untouched in the database"


        res.json(updatedPatient) // 200 OK
    } catch (err ){
        console.error("Error inserting patient:", err);
        res.status(500).send("Internal server error with PUT /patient:id")
    }

};

export const deletePatient  = async (req, res ) => {
    try {
        const id = parseInt(req.params.id)
        if(isNaN(id))
            return res.status(400).send("Invalid patient ID")

        const result = await getPatientCollection().deleteOne({id});

        if( result.deletedCount === 0 ){
            return res.status(404).send("No patient with that ID found. Nothing deleted")
        }

        res.status(204).end()
    }catch (err){
        res.status(500).send("Internal server error with DELETE /patient:id")
    }
}

