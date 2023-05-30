import multer from "multer";
import path from 'path';
import CustomErrorHandler from "../services/CustomErrorHandler";
import Joi from "joi";
import fs from 'fs'
import { Product } from "../models";

const storage = multer.diskStorage({
    destination: (req, file, callback) => callback(null, 'uploads/'), //null for error
    filename: (req, file, callback) =>{
        const uniqueName = `${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`; // its generate unique name
        callback(null, uniqueName);
    }
});

const handleMultipartData = multer({storage, limits: {fileSize: 1000000 * 10 }}).single('image'); //10 MB filesize

const productController = {
    async store(req, res, next){
        //Multipart form data

        handleMultipartData(req, res, async (err)=> {
            if(err) {
                return next(CustomErrorHandler.serverError(err.message)); 
            }

            const filePath = req.file.path;

            //Validation
            const productSchema = Joi.object({
                name: Joi.string().required(),
                price: Joi.number().required(),
                size: Joi.string().required()
            });
    
            const { error } = productSchema.validate(req.body); 

            if(error) {
                //Delete the uploaded file
                //rootFolder/uploads/filename
                fs.unlink(`${appRoot}/${filePath}`, (err)=>{
                    if(err) {
                        return next(CustomErrorHandler.serverError(err.message)); 
                    }

                });
                return next(error);
            }
            const {name , price, size} = req.body;
            let document;

            try {
                document = await Product.create({
                    name: name,
                    price: price,
                    size: size,
                    image: filePath
                });
            } catch (err) {
                return next(err);
            }
            res.status(201).json(document);
        });
 
    }
}



export default productController;