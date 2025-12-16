import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateToken = (allowedRoles) => {

    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(400).json({error: 'The authorization is needed'})
        }
        const token = authHeader.substring(7);

        jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
            if(err){
                return res.status(401).json({error: 'Token expired or invalid'})
            }

            const userRole = decodedUser.role;

            if (allowedRoles && !allowedRoles.includes(userRole)) {
                return res.status(403).json({ error: 'Access denied: Insufficient role' });
            }

            req.user = decodedUser;
            next();
        });
    };
};