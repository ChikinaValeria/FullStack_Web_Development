import Joi from "joi"

const movieSchema = Joi.object({
    title: Joi.string().min(1).max(100).required(),
    director: Joi.string().min(3).max(100).default('Unknown'),
    year: Joi.number().integer().min(1887).max(2026).required()
})

// This is a custom function to validate the HTTP request data from the client
export const validateMovie = (req, res, next) => {
    // considering also value ('Unknown' director)
   const { error, value } = movieSchema.validate( req.body );
   if( error ){
        return res.status(400).json({ error: error.details[0].message })
   }
   // return validated body (value) instead of body
   req.body = value;
   next(); // the data is valid :)
}