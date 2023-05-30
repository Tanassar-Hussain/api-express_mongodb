import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, callback) => callback(null, 'uploads/')
})

const productController = {
    async store(req, res, next){
        //Multipart form data
 
    }
}



export default productController;