class CustomErrorHandler extends Error {
    constructor(status , msg){
        this.status = status;
        this.message = msg;
    }





    static alreadyExist(message) {
        return new CustomErrorHandler(409, message); //return object of same class to middleware errorHandler
    }
}

export default CustomErrorHandler;  