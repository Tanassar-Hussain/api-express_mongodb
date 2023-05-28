import Joi from "joi";
import CustomErrorHandler from "../../services/CustomErrorHandler";

const registerController = {

    async register(req , res , next){
 
 

        //Validation
        const registerSchema = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            repeat_password: Joi.ref('password')
        });


        const { error } = registerSchema.validate(req.body);

        if(error){
            return next(error);
        }

        // check if user is in the database already

        try{
            const exist = await User.exists({email: req.body.email});
            if(exist)
            {
                return next(CustomErrorHandler.alreadyExist('This Email is alredy exist...')); //it return instance/object of custom error handler
            }
        }catch(err){

        }

        res.json({msg:'Hello from express'})
    }
}   



export default registerController;