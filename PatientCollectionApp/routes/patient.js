import { Router } from 'express'
import { getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie
} from '../controllers/patientController.js';
import { validatePation } from '../middleware/validatePatient.js';
import { logger } from '../middleware/logger.js';
import {authenticateToken} from '../middleware/authenticateToken.js';

const patientRouter = Router();

patientRouter.get('/', logger, getAllPatients)
patientRouter.get('/:id', logger, getPatientById)
patientRouter.post('/', logger, authenticateToken, validatePatient, createPatient)
patientRouter.put('/:id', logger, authenticateToken, validatePatient, updatePatient)
patientRouter.delete('/:id', logger, authenticateToken, deletePatient)


export default patientRouter;