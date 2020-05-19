import { Error } from "mongoose";
import UserModel from "@framework/models/user.model";

/**
 * Mock the ErrorParser dependency
 * 
 * Just return the parser name
 * instead of the whole function
 */
jest.mock('@framework/libs/error-parser', () => ({
    __esModule: true,
    ErrorParser: {
        Mongoose: jest.fn((err) => "Mongoose")
    }
}));

/**
 * Mock the failed response dependency
 * of the error handler
 * 
 * Use this to return a dummy data
 * that will be used in the expections
 */
jest.mock('@framework/libs/response', () => ({
    __esModule: true,
    failed: jest.fn(
        (res, data, msg, code) => {
            if (data == '') {
                data = 'Empty';
            }

            return {
                success: false,
                message: msg,
                data: data,
            };
        }
    )
 }));

import { ErrorHandler } from "@framework/middlewares/error-handler";

describe('Middlewares/error-handler', () => {

    it('Should skip if headers sent', () => {
        //
        const err = 'error';
        const res = {headersSent: true};
        const next = jest.fn();

        ErrorHandler(err, '', res, next);
        expect(next).toHaveBeenCalledWith(err);
    });

    it('Should process empty error', () => {
        //
        const err = '';
        const next = jest.fn();

        const expected = {"data": "Empty", "message": "Error", "success": false};

        expect(ErrorHandler(err, '', {}, next)).toEqual(expected);
    });

    it('Should process Mongoose error', () => {
        //
        const err = new Error.ValidationError(new UserModel());
        const next = jest.fn();

        const expected =  {"data": "Mongoose", "message": "Validation Failed", "success": false};

        expect(ErrorHandler(err, '', '', next)).toEqual(expected);
    });

});