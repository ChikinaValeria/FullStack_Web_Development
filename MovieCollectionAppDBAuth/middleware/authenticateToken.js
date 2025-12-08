import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
// Load the .env file
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(400).json({error: 'The authorization is needed'})
    }
    const token = authHeader.substring(7); // after 'Bearer '

    jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
        if(err){
            return res.status(401).json({error: 'Token expired or invalid'})
        }
        req.user = decodedUser;
        next();
    })

}