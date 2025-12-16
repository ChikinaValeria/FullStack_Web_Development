// config/dbConfig.js
import mongoose from "mongoose";
import { Patient } from "../models/patientModel.js";

// Initial patients used to seed the database if it is empty
const initialPatients = [
    {
        name: "Onni Makinen",
        age: 72,
        department: "cardiology",
        diagnosis: "Heart Stroke",
        accepted: "2025-11-24"
    },
    {
        name: "Pekka Suolainen",
        age: 22,
        department: "dermatology",
        diagnosis: "Diathesis",
        accepted: "2025-11-30"
    },
    {
        name: "Harri Nelonen",
        age: 38,
        department: "neurology",
        diagnosis: "Peripheral Neuropathy",
        accepted: "2025-12-10"
    }
];

export const initDatabase = async () => {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        console.error("MONGODB_URI is not defined");
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB with Mongoose");

         const count = await Patient.countDocuments();
        if (count === 0) {
            await Patient.insertMany(initialPatients);
            console.log("Initial patients inserted into database");
        } else {
            console.log("Patients collection already contains data");
        }
    } catch (err) {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    }
};
