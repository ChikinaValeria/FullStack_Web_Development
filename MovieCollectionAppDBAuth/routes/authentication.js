import { Router } from 'express'
import { signup,
   login
} from '../controllers/authController.js';

const authenticationRouter = Router();

//post sign-up
authenticationRouter.post('/signup', signup);

// post login
authenticationRouter.post('/login', login);

export default authenticationRouter;