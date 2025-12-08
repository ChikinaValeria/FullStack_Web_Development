import { getMovieCollection } from "../config/dbConfig.js";

export const generateNextId = async() => {

    const movieCollection = getMovieCollection();
    // find movie with max id
    const maxIdMovie = await movieCollection.findOne(
        {}, //no filter, searching through entire collection
        {
            sort: { id: -1 }, // sorting by id desc
            projection: { id: 1, _id: 0 } // including id, excluding _id
        }
    );

    // if the collection is empty, start with one, else max+1
    if (!maxIdMovie) {
        return 1;
    } else {
        return maxIdMovie.id + 1;
    }
}

// legacy validation function
export const validateMovieData = (movie) => {
    const {title, director, year} = movie

    if(!title || typeof title !== 'string') return "Invalid or missing 'title'"
    if( year === undefined || typeof year !== 'number' || year < 1888 ) return "Invalid or missing 'year'"
    if( !director || typeof director !== 'string') return "Invalid or missing 'director'";

    return null // the data is valid :)

}