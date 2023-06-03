import mongoose from "mongoose";
import { APP_URL } from '../config';
const Schema = mongoose.Schema;

const productSchema = new Schema({

    name: { type: String, required: true},
    price: { type: Number, required: true},
    size: { type: String, required: true},
    image: { type: String, required: true, get: (image)=>{
        //Add domain name with image so it can be get from any server

        return `${APP_URL}/${image}`
    }},
     
}, {timestamps: true, toJSON: {getters: true}, id:false });



export default mongoose.model('Product' , productSchema);