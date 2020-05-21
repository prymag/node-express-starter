jest.mock('@framework/models/user.model');
jest.mock('@framework/libs/token');

import { jwtVerify } from "@framework/middlewares/jwt-verify";
import UserModel from "@framework/models/user.model";
import * as token from "@framework/libs/token";

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

   it('Should call next on error', (done) => {
        //
        const req = {cookies: {token :'invalidtoken'}};
        const res = {};

        jest.spyOn(token, 'verifyJWT').mockImplementation(() => {
            throw new Error();
        });

        const next = (err) => {
            //
            expect(err).toBeTruthy();
            done();
        };

        jwtVerify(req, res, next);
    });

    it('Should call next if user not found', (done) => {
        //
        const mockError = new Error('Cannot find user');

        const req = {cookies: {token :'validtoken'}};
        const res = {};
        const next = (err) => {
            expect(err).toEqual(mockError);
            done();
        };

        jest.spyOn(token, 'verifyJWT').mockImplementation(() => Promise.resolve({id: '1234'}));
        jest.spyOn(UserModel, 'findById').mockReturnValue(Promise.reject(mockError));

        jwtVerify(req, res, next);
    });

    it('Should call next with unauthorized message', (done) => {
        //
        expect.assertions(2);
        const req = {cookies: {}};
        const res = {}; 

        const next = (err) => {
            //
            expect(err).toBeInstanceOf(Error);
            expect(err.message).toBe('Unauthorized');
            done();
        };

        jwtVerify(req, res, next);
    });

});