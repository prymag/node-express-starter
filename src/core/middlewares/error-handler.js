import { failed } from "@core/libs/response";
import { ErrorParser } from "@core/libs/error-parser";
import { AppError } from "@core/libs/error-builder";
import { Error } from "mongoose";

function error(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    
    let errorData = {}, 
        msg = 'Error', 
        statusCode = 500;

    if (err instanceof Error.ValidationError) {
        errorData = ErrorParser.Mongoose(err);
        msg = 'Error: Validation Failed';
        statusCode = 422;
    }

    if (err instanceof AppError) {
        errorData = err.data;
        statusCode = err.statusCode;
        msg = err.msg;
    }

    return failed(res, errorData, msg, statusCode);
}

export {error as ErrorHandler};