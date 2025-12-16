import Joi from "joi"

const patientSchema = Joi.object({
    name: Joi.string().min(1).max(100).default('Unknown patient'),
    age: Joi.number().integer().min(0).max(130).default(null),
    department: Joi.string().valid('cardiology', 'neurology', 'dermatology').required(),
    diagnosis: Joi.string().min(5).max(100).default('Unknown desease'),
    accepted: Joi.date().iso().min('2025-01-01').required()
})

// This is a custom function to validate the HTTP request data from the client
export const validatePatient = (req, res, next) => {
   const { error, value } = patientSchema.validate( req.body );
   if( error ){
        return res.status(400).json({ error: error.details[0].message })
   }
   // return validated body (value) instead of body
   req.body = value;
   next(); // the data is valid
}