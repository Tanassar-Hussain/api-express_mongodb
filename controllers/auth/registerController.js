import Joi from "joi";
import { RefreshToken, User } from '../../models';
import bcrypt from 'bcrypt';
import CustomErrorHandler from "../../services/CustomErrorHandler";
import JwtService from "../../services/JwtService";
import { REFRESH_SECRET } from "../../config";

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
            return next(err);
        }

        const {name, email, password} = req.body;

        //Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        //prepare the model
        const user = new User({
            name: name,
            email: email,
            password: hashedPassword
        })

        let access_token;
        let refresh_token;
 
        try{
            const result = await user.save();
            console.log(result);
 
            // Token
            access_token = JwtService.sign({_id: result._id, role: result.role})
            refresh_token = JwtService.sign({_id: result._id, role: result.role}, '1y', REFRESH_SECRET )

            //Database Wishlist

            await RefreshToken.create({token: refresh_token})

        } catch(err){
            return next(err);
        }

        res.json({access_token: access_token , refresh_token: refresh_token});
    }
}   
export default registerController;