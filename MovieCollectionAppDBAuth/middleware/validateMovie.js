import Joi from "joi"

const movieSchema = Joi.object({
    title: Joi.string().min(1).max(100).required(),
    director: Joi.string().min(3).max(100).required().default('Unknown'),
    year: Joi.number().integer().min(1887).max(2026).required()
})

// This is a custom function to validate the HTTP request data from the client
export const validateMovie = (req, res, next) => {
   const { error } = movieSchema.validate( req.body );
   if( error ){
        return res.status(400).json({ error: error.details[0].message })
   }
   next(); // the data is valid :)
}