import { failed } from "@core/libs/response";
import { AppError } from "@core/libs/error-builder/application";
import { Error as MongooseError } from "mongoose";

function error(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    
    let errorData = {}, 
        msg = 'Error', 
        statusCode = 500;

    if (err instanceof MongooseError.ValidationError) {
        errorData = mongooseValidationErrorToErrorData(err);
        statusCode = 422;
        msg = 'Error: Validation Failed';
    }

    if (err instanceof AppError) {
        errorData = err.data;
        statusCode = err.statusCode;
        msg = err.msg;
    }

    return failed(res, errorData, msg, statusCode);
}

function mongooseValidationErrorToErrorData(error) {
    //
    const errorData = [];
    Object.keys(error.errors)
        .forEach((key, index) => {
            //
            const data = {
                field: error.errors[key].path,
                type: error.errors[key].kind,
                message: error.errors[key].message.replace('Path ', '')
            };
            errorData.push(data);
        });
    return errorData;
}

export {error as ErrorHandler};
export { mongooseValidationErrorToErrorData };
