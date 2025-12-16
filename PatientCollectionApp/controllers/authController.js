import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {users, getNextUserId} from '../data/usersData.js'
import dotenv from "dotenv";
// Load the .env file
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const signup = async (req, res) => {
    const {name, role, password} = req.body;

    if (!name || !password)
        return res.status(400).json({error: 'username and password required'});

    const existing = users.find(u => u.name === name);
    if (existing)
        return res.status(409).json({error: 'username already exists'});// 409 conflict

    const userRole = (role && role.toLowerCase() === 'admin') ? 'admin' : 'regular';

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
        id: getNextUserId(),
        name,
        role: userRole,
        passwordHash
    };

    users.push(newUser);
    console.log("Users now: ", users)
    res.status(201).json({id: newUser.id, name: newUser.name, role: newUser.role});
};

export const login = async(req, res) => {
    // create JWD bearer token if username and password are correct
    const {name, password} = req.body;
    const user = users.find( u => u.name === name);
    if(!user)
        return res.status(401).json({error: 'No user with this username'});

    const passwordOk = await bcrypt.compare(password, user.passwordHash);
    if(!passwordOk)
        return res.status(401).json({error: 'username and password do not match'});

    // creating token
    const payload = {id: user.id, name: user.name, role: user.role};

    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: '1h'});
    console.log("Bearer token created: ", token)

    res.json({token});
};