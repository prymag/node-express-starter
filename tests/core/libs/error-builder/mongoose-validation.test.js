import HttpStatus from "http-status-codes";
import { MongooseValidationError } from "@core/libs/error-builder/mongoose-validation";
import UserModel from "@core/models/user.model";
import { Error as MongooseError } from "mongoose";

describe('@core/libs/error-builder/mongoose-validation', () => {
    //
    it ('Should throw an error', () => {
        //
        const expected = new Error('Mongoose model not specified');
        expect(() => new MongooseValidationError()).toThrow(expected);
    });

    it('Shoud build Mongoose validation error', () => {
        //
        const errors = {
            password: {
                type: 'length',
                path: 'password',
                message: 'The password field should be atleast 6 characters.',
                value: 'value'
            }
        };

        const expectedErrors = {
            "password": new MongooseError.ValidatorError({message: 'The password field should be atleast 6 characters.'})
        };

        const error = new MongooseValidationError(UserModel)
            .setErrors(errors)
            .getError();

        expect(error).toBeInstanceOf(MongooseError);
        expect(error.errors).toEqual(expectedErrors);
    });

    it('Should set empty error as default', () => {
        //
        const error = new MongooseValidationError(UserModel)
            .setErrors()
            .getError();
        
        expect(error.errors).toEqual({});
    });

});