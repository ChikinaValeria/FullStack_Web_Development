import { Router } from 'express'
import { getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie
} from '../controllers/movieController.js';
import { validateMovie } from '../middleware/validateMovie.js';
import { logger } from '../middleware/logger.js';
//import {authenticateToken} from '../middleware/authenticateToken.js';

// create the router
const movieRouter = Router();

//middleware - function, which is called in the middle
//to validate data before we pass it to createMovie
movieRouter.get('/', logger, getAllMovies)
movieRouter.get('/:id', logger, getMovieById)
movieRouter.post('/', validateMovie, createMovie)
movieRouter.put('/:id', validateMovie, updateMovie)
movieRouter.delete('/:id', deleteMovie)

//export router
export default movieRouter;