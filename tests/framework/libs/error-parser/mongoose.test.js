import UserModel from "@framework/models/user.model";
import { Error } from "mongoose";
import parse from "@framework/libs/error-parser/mongoose";

describe('Libs/error-parser/mongoose', () => {

    it('Should parse mongoose error', () => {
        //
        const error = new Error.ValidationError(new UserModel());
        error.errors = {
            password: new Error.ValidatorError({message: 'Error message', type: 'error-type', path: 'password'})
        };

        const expected = [{
            field: 'password',
            type: 'error-type',
            message: 'Error message'
        }];

        const result = parse(error);

        expect(result).toEqual(expected);
    });

    it('Should have empty errors', () => {
        //
        const error = new Error.ValidationError(new UserModel());
        const result = parse(error);
        
        expect(result.errors).toBeUndefined();
    });

});