import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {users, getNextUserId} from '../data/usersData.js'
import dotenv from "dotenv";
// Load the .env file
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const signup = async (req, res) => {
    const {name, username, password} = req.body;

    if (!username || !password)
        return res.status(400).json({error: 'username and password required'});

    const existing = users.find(u => u.username === username);
    if (existing)
        return res.status(409).json({error: 'username already exists'});// 409 conflict

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
        id: getNextUserId(),
        name,
        username,
        passwordHash
    };

    users.push(newUser);
    console.log("Users now: ", users)
    res.status(201).json({id: newUser.id, username: newUser.username, name: newUser.name});
};

export const login = async(req, res) => {
    // create JWD bearer token if username and password are correct
    const {username, password} = req.body;
    const user = users.find( u => u.username === username);
    if(!user)
        return res.status(401).json({error: 'No user with this username'});

    const passwordOk = await bcrypt.compare(password, user.passwordHash);
    if(!passwordOk)
        return res.status(401).json({error: 'username and password do not match'});

    // creating token
    const payload = {id: user.id, username: user.username};

    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: '1h'});
    console.log("Bearer token created: ", token)

    res.json({token});
};