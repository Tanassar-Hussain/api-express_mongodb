import multer from "multer";
import path from 'path';
import CustomErrorHandler from "../services/CustomErrorHandler";
import fs from 'fs'
import { Product } from "../models";
import productSchema from "../validators/productValidator";

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
            filePath.replace("'\'", "'/'")
    
    
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
 
    },

    update(req, res, next){

        handleMultipartData(req, res, async (err)=> {
            if(err) {
                return next(CustomErrorHandler.serverError(err.message)); 
            }
            let filePath
            if(req.fle) {
                filePath = req.file.path;
            }
    
            const { error } = productSchema.validate(req.body); 

            if(error) {
                //Delete the uploaded file
                //rootFolder/uploads/filename

                if(req.file){
                    fs.unlink(`${appRoot}/${filePath}`, (err)=>{
                        if(err) {
                            return next(CustomErrorHandler.serverError(err.message)); 
                        }
    
                    });
                }

                return next(error);
            }
            const {name , price, size} = req.body;

            let document;

            try {
                document = await Product.findOneAndUpdate({ _id: req.params.id} , {
                    name: name,
                    price: price,
                    size: size,
                    ...(req.file && {image: filePath})
                },{new: true});
            } catch (err) {
                return next(err);
            }
            res.status(201).json(document);
        });

    },

    async destroy(req, res, next){
        const document = await Product.findByIdAndRemove({_id: req.params.id});
        if(!document){
            return next(new Error('Nothing to Delete'));
        }
        // image delete
        const imagePath = document._doc.image;

        fs.unlink(`${appRoot}/${imagePath}`,(err)=>{
            if(err){
                return next(CustomErrorHandler.serverError());
            }
        });

        res.json(document);
    },

    async index(req, res, next){
        let documents;
        //pagination mongoose-pagination

        try {                         //method chaining               //sort in desending order with id if u want with createdAt put here that..
            documents = await Product.find().select('-updatedAt -__v').sort({_id: -1}); //find if limited data if in thousands than use pagination. 
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }

        return res.json(documents);
    },

    async show(req, res, next){
        let document;

        try {
            document = await Product.findOne({_id: req.params.id}).select('-updatedAt -__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(document);
    }
}



export default productController;