import { DEBUG_MODE } from "../config";
import { ValidationError } from "joi";
const errorHandler = (err , req , res , next) =>{

    let statusCode = 500;

    let data = {
        message: 'Internal Server Error',
        ...(DEBUG_MODE === 'true' && {originalError: err.message}) // Spread Syntax for condition

    }

    if(err instanceof ValidationError){ //its is related to joi from controller validation

    }
}




export default errorHandler;