import build from "@framework/libs/error-builder/mongoose";
import UserModel from '@framework/models/user.model';

import { Error } from 'mongoose';

describe('Lib/error-builder/mongoose', () => {
    //
    it('Should create a mongoose error object', () => {
        //
        const params = {
            model: UserModel,
            errors: {
                password: {
                    type: 'length',
                    path: 'password',
                    message: 'The password field should be atleast 6 characters.',
                    value: 'value'
                }
            }
        };

        const expected = {
            password: {
                message: 'The password field should be atleast 6 characters.',
                name: 'ValidatorError',
                properties: {
                message: 'The password field should be atleast 6 characters.',
                    path: 'password',
                    type: 'length',
                    value: 'value'
                },
                kind: 'length',
                path: 'password',
                value: 'value',
                reason: undefined
            }
        };

        const result = build(params);

        expect(result).toBeInstanceOf(Error.ValidationError);
        expect(result).toHaveProperty('errors', expected);
        
    });

    it('Should throw an error', () => {
        //
        expect(() => buildError({})).toThrowError();
    });

});