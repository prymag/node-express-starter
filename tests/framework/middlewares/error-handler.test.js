import { Error } from "mongoose";
import UserModel from "@framework/models/user.model";

/**
 * Mock the ErrorParser dependency
 * 
 * Just return the parser name
 * instead of the whole function
 */
jest.mock('@framework/libs/error-parser');

/**
 * Mock the failed response dependency
 * of the error handler
 * 
 * Use this to return a dummy data
 * that will be used in the expections
 */
jest.mock('@framework/libs/response');

import { ErrorHandler } from "@framework/middlewares/error-handler";
import { ErrorParser } from "@framework/libs/error-parser";
import * as response from "@framework/libs/response";
import buildError from "@framework/libs/error-builder";


describe('Middlewares/error-handler', () => {

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
        expect.assertions(4);

        const err = new Error.ValidationError(new UserModel());
        const req = {};
        const res = {};
        const next = jest.fn();

        const mockValidationData = [
            {
                field: 'Password',
                type: 'length',
                message: ''
            }
        ];
        const mockReturn = {
            success: false,
            message: "Error: Validation Failed",
            data: mockValidationData,
        };

        const mockResponseFailed = jest.fn().mockReturnValue(mockReturn);
        response.failed = mockResponseFailed;

        const mockMongooseParser = jest.fn().mockReturnValue('MockParseResult');
        ErrorParser.Mongoose = mockMongooseParser;

        const expected =  {"data": mockValidationData, "message": "Error: Validation Failed", "success": false};

        const result = ErrorHandler(err, req, res, next);
    
        expect(result).toEqual(expected);
        expect(mockMongooseParser).toHaveBeenCalledWith(err);
        expect(next).not.toHaveBeenCalled();
        expect(mockResponseFailed).toHaveBeenCalledWith(res, 'MockParseResult', 'Error: Validation Failed', 422);
    });

    it('Should process application error', () => {
        //
        const err = buildError('app').setTitle('Unauthorized').setStatusCode(401);
        const req = {};
        const res = {};
        const next = jest.fn();
        
        const mockResponseFailed = jest.fn();
        response.failed = mockResponseFailed;

        ErrorHandler(err, req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(response.failed).toHaveBeenCalledWith(res, 'Error: Unauthorized', 'Unauthorized: ', 401);

    });

});