import { failed } from "@framework/libs/response/response";
import { Errors } from "@framework/libs/error/error";
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
            Errors.Mongoose.toJSON(err), 
            'Validation Failed', 
            StatusCodes.UNPROCESSABLE_ENTITY
        );
    }    

    failed(res, err, 'Error');
}

export {error as ErrorHandler};