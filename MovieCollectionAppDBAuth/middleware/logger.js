export const logger = (req, res, next) =>{
    console.log('This is just a logging middleware')
    next();// middleware executed, go to the next middleware or proceed with the controller
}
