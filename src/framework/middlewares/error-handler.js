import { failed } from "@framework/libs/response";
import { ErrorParser } from "@framework/libs/error-parser";
import { Error } from "mongoose";
import * as StatusCodes from "http-status-codes";

function error(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    console.log(err);
    if (err instanceof Error.ValidationError) {
        return failed(
            res, 
            ErrorParser.Mongoose(err), 
            'Validation Failed', 
            StatusCodes.UNPROCESSABLE_ENTITY
        );
    }    

    failed(res, err, 'Error');
}

export {error as ErrorHandler};