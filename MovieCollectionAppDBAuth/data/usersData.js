import bcrypt from 'bcrypt'

export const users = [
    {
        id:1,
        name: "john",
        username: "rock_john",
        passwordHash: bcrypt.hashSync("password123", 10)
    },
    {
        id:2,
        name: "maria",
        username: "bloody_mary",
        passwordHash: bcrypt.hashSync("mypassword", 10)
    }
];

let nextId = 3;
export const getNextUserId = () => nextId++;