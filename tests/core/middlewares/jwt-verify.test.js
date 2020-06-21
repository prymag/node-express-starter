jest.mock('@core/models/user.model');
jest.mock('@core/libs/token');
jest.mock('@core/libs/error-builder/application');

import { jwtVerify } from "@core/middlewares/jwt-verify";
import UserModel from "@core/models/user.model";
import * as token from "@core/libs/token";
import { AppError } from "@core/libs/error-builder/application";
import HttpStatus from "http-status-codes";

describe('Middlewares/jwt-verify', () => {
    //
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('Should verify user', (done) => {
        //
        expect.assertions(2);
        const req = {
            cookies: {token: 'samplevalidtoken'}
        };
        const res = {};

        const expectedUser = {
            _id: '1234',
            username: 'sampleuser',
            password: 'encryptedpassword',
            firstname: 'myfirstane',
            lastname: 'mylastname'
        };

        jest.spyOn(UserModel, 'findById').mockReturnValue(Promise.resolve(expectedUser));
        jest.spyOn(token, 'verifyJWT').mockReturnValue({_id: '1234'});
    
        const next = (err) => {
            //
            expect(err).toBeFalsy();
            expect(req.user).toEqual(expectedUser);
            done();
        };
        
        jwtVerify(req, res, next);
    });

   it('Should call next on error', () => {
        //
        expect.assertions(1);
        
        const req = {cookies: {token :'invalidtoken'}};
        const res = {};

        const mockError = new Error('Mock Invalid jwt');
        jest.spyOn(token, 'verifyJWT').mockImplementation(() => {
            throw mockError;
        });
        const next = jest.fn();

        jwtVerify(req, res, next);
        expect(next).toHaveBeenCalledWith(mockError);
    });

    it('Should call next if user not found', (done) => {
        //
        const mockError = new Error('Cannot find user');

        const req = {cookies: {token :'validtoken'}};
        const res = {};

        // next function is inside the catch block
        // mocking next does not seem be to called
        // so we do it this way instead
        const next = (err) => {
            expect(err).toEqual(mockError);
            done();
        };

        jest.spyOn(token, 'verifyJWT').mockImplementation(() => Promise.resolve({id: '1234'}));
        jest.spyOn(UserModel, 'findById').mockReturnValue(Promise.reject(mockError));

        jwtVerify(req, res, next);
    });

    it('Should handle unauthorized', () => {
        //
        expect.assertions(4);
        const req = {cookies: {}};
        const res = {}; 

        const next = jest.fn();
        
        const mockSetTitle = jest.fn().mockReturnThis();
        const mockSetStatusCode = jest.fn().mockReturnThis();

        AppError.mockReturnValue({
            setTitle: mockSetTitle,
            setStatusCode: mockSetStatusCode
        });
        
        jwtVerify(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(AppError).toHaveBeenCalled();
        expect(mockSetTitle).toHaveBeenCalledWith('Unauthorized');
        expect(mockSetStatusCode).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    });

});