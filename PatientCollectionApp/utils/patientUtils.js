import { getPatientCollection } from "../config/dbConfig.js";

export const generateNextId = async() => {

    const patientCollection = getPatientCollection();
    const maxIdPatient = await patientCollection.findOne(
        {}, //no filter, searching through entire collection
        {
            sort: { id: -1 }, // sorting by id desc
            projection: { id: 1, _id: 0 } // including id, excluding _id
        }
    );

    // if the collection is empty, start with one, else max+1
    if (!maxIdPatient) {
        return 1;
    } else {
        return maxIdPatient.id + 1;
    }
}