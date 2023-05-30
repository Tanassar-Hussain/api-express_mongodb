class CustomErrorHandler extends Error {
    constructor(status , msg){
        super(); // it calls extends class constuctor
        this.status = status;
        this.message = msg;
    }





    static alreadyExist(message) {
        return new CustomErrorHandler(409, message); //return object of same class to middleware errorHandler
    }


    static wrongCredentials(message = 'Username or Password is wrong!') {
        return new CustomErrorHandler(401, message);
    }

    static unAuthorized(message = 'unAuthorized') {
        return new CustomErrorHandler(401, message);
    }

    static notFound(message = '404 Not Found') {
        return new CustomErrorHandler(404, message);
    }

    static serverError(message = 'Internal Server Error') {
        return new CustomErrorHandler(500, message);
    }
}

export default CustomErrorHandler;  