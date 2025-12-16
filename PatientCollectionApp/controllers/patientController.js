//patientController.js

import { Patient } from "../models/patientModel.js";

export const getAllPatients = async (req, res) => {
    try {
        const filter = {};

        // Case-insensitive filtering using regex
        if (req.query.name) {
            filter.name = { $regex: req.query.name, $options: "i" };
        }

        if (req.query.department) {
            filter.department = { $regex: req.query.department, $options: "i" };
        }

        if (req.query.diagnosis) {
            filter.diagnosis = { $regex: req.query.diagnosis, $options: "i" };
        }

        if (req.query.fromDate || req.query.toDate) {
            filter.accepted = {};

            if (req.query.fromDate) {
                filter.accepted.$gte = req.query.fromDate;
            }

            if (req.query.toDate) {
                filter.accepted.$lte = req.query.toDate;
            }
        }

        const result = await Patient.find(filter);
        res.json(result);
    } catch (err) {
        console.log("GET /patients error:", err);
        res.status(500).json({
            error: "Internal server error. Some problem with the database."
        });
    }
};

export const getPatientById = async (req, res) => {
    try {
        const id = req.params.id;

        const patient = await Patient.findById(id);
        if (patient) {
            res.json(patient);
        } else {
            res.status(404).json({
                message: "Patient with that id not found"
            });
        }
    } catch (err) {
        res.status(500).send(
            "Internal server error with DB connection"
        );
    }
};

export const createPatient = async (req, res) => {
    try {
        const { name, age, department, diagnosis, accepted } = req.body;

        const newPatient = {
            name,
            age,
            department,
            diagnosis,
            accepted
        };

        const created = await Patient.create(newPatient);
        res.status(201).json(created);
    } catch (err) {
        console.error("Error inserting patient:", err);
        res.status(500).send(
            "Internal server error with POST /patient"
        );
    }
};

export const updatePatient = async (req, res) => {
    try {
        const id = req.params.id;

        const existing = await Patient.findById(id);
        if (!existing) {
            return res
                .status(404)
                .send("No patient with that ID found");
        }

        const updatedPatient = await Patient.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        res.json(updatedPatient);
    } catch (err) {
        console.error("Error updating patient:", err);
        res.status(500).send(
            "Internal server error with PUT /patient:id"
        );
    }
};

export const deletePatient = async (req, res) => {
    try {
        const id = req.params.id;

        const result = await Patient.findByIdAndDelete(id);

        if (!result) {
            return res
                .status(404)
                .send("No patient with that ID found. Nothing deleted");
        }

        res.status(204).end();
    } catch (err) {
        res.status(500).send(
            "Internal server error with DELETE /patient:id"
        );
    }
};
