import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "Unknown patient",
        trim: true
    },
    age: {
        type: Number,
        min: 0,
        max: 130,
        default: "Unknown age"
    },
    department: {
        type: String,
        enum: ["cardiology", "neurology", "dermatology"],
        required: true
    },
    diagnosis: {
        type: String,
        default: "Unknown disease"
    },
    accepted: {
        type: Date,
        required: true
    }
});

export const Patient = mongoose.model("Patient", patientSchema);