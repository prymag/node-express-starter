import { Error } from "mongoose";

function build(params) {
    //
    if (!params || !params.hasOwnProperty('model')) {
        throw new Error('Mongoose model or params not specified');
    }

    const error = new Error.ValidationError(new params.model());

    Object.keys(params.errors).forEach((key) => {
        //
        error.errors[key] = new Error.ValidatorError({
            message: params.errors[key].message,
            path: params.errors[key].path,
            type: params.errors[key].type,
            value: params.errors[key].value
        });
    });
    
    return error;
}

export default build;