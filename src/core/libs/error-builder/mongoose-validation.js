import { Error as MongooseError } from "mongoose";

class MongooseValidationError {
    
    constructor(model) {
        //
        if (!model) {
            throw new Error('Mongoose model not specified');
        }

        this._error = new MongooseError.ValidationError(new model());
        return this;
    }

    setErrors(errorObject = {}) {
        //
        Object.keys(errorObject).forEach((key) => {
            //
            this._error.errors[key] = new MongooseError.ValidatorError({
                message: errorObject[key].message,
                path: errorObject[key].path,
                type: errorObject[key].type,
                value: errorObject[key].value
            });
        });

        return this;
    }

    getError() {
        return this._error;
    }

}

export { MongooseValidationError };