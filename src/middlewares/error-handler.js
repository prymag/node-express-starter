import { failed } from "../libs/response/response";
import { Error } from "mongoose";
import * as StatusCodes from "http-status-codes";
import { Errors } from "../libs/error/error";

function error(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }

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