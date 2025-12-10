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
patientRouter.get('/:id', logger, authenticateToken(['admin', 'regular']), getPatientById)
patientRouter.post('/', logger, authenticateToken(['admin']), validatePatient, createPatient)
patientRouter.put('/:id', logger, authenticateToken(['admin']), validatePatient, updatePatient)
patientRouter.delete('/:id', logger, authenticateToken(['admin']), deletePatient)


export default patientRouter;