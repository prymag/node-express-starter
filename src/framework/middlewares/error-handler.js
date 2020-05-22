import { failed } from "@framework/libs/response";
import { ErrorParser } from "@framework/libs/error-parser";
import { Error } from "mongoose";
import { AppError } from "@framework/libs/error-builder";

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
        errorData = `Error: ${err.title}`;
        statusCode = err.statusCode;
        msg = `${err.title}: ${err.msg}`;
    }

    return failed(res, errorData, msg, statusCode);
}

export {error as ErrorHandler};