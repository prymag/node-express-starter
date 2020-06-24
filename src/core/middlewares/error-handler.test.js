import { Error } from "mongoose";
import UserModel from "@core/models/user.model";

/**
 * Mock the failed response dependency
 * of the error handler
 * 
 * Use this to return a dummy data
 * that will be used in the expections
 */
jest.mock('@core/libs/response');

import { ErrorHandler } from "@core/middlewares/error-handler";
import * as response from "@core/libs/response";
import { AppError } from "@core/libs/error-builder/application";


describe('@core/middlewares/error-handler', () => {

    afterEach(() => {
        jest.restoreAllMocks();
    });

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
        expect.assertions(3);

        const err = {};
        const next = jest.fn();
        const res = {};

        const mockReturn = {
            success: false,
            message: "Error",
            data: "Empty",
        };

        const mockResponseFailed = jest.fn().mockReturnValue(mockReturn);
        response.failed = mockResponseFailed;

        const expected = {"data": "Empty", "message": "Error", "success": false};

        expect(ErrorHandler(err, '', {}, next)).toEqual(expected);
        expect(next).not.toHaveBeenCalled();
        expect(mockResponseFailed).toHaveBeenCalledWith(res, err, 'Error', 500);
    });

    it('Should process Mongoose error', () => {
        //
        expect.assertions(3);

        const err = new Error.ValidationError(new UserModel());
        const req = {};
        const res = {};
        const next = jest.fn();

        err.errors = {
            password: new Error.ValidatorError({
                field: 'Password',
                type: 'length',
                path: 'password',
                value: '***'
            })
        };

        const mockValidationData = [
            {
                "field": "password", 
                "message": "Validator failed for path `password` with value `***`", 
                "type": "length"
            }
        ];
        const mockReturn = {
            success: false,
            message: "Error: Validation Failed",
            data: mockValidationData,
        };

        const mockResponseFailed = jest.fn().mockReturnValue(mockReturn);
        response.failed = mockResponseFailed;

        const expected =  {"data": mockValidationData, "message": "Error: Validation Failed", "success": false};

        const result = ErrorHandler(err, req, res, next);

        expect(mockResponseFailed).toHaveBeenCalledWith(res, mockValidationData, 'Error: Validation Failed', 422);
        expect(next).not.toHaveBeenCalled();
        expect(result).toEqual(expected);
    });

    it('Should process application error', () => {
        //
        const data = {
            eType: 'notFound',
            eDtail: 'userNotFound'
        };
        const err = new AppError()
            .setData(data)
            .setMsg('User not found')
            .setStatusCode(404);

        const req = {};
        const res = {};
        const next = jest.fn();
        
        const mockResponseFailed = jest.fn();
        response.failed = mockResponseFailed;

        ErrorHandler(err, req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(response.failed).toHaveBeenCalledWith(res, data, 'User not found', 404);

    });

});