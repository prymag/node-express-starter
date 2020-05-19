jest.mock('@framework/models/user.model', () => ({
    __esModule: true,
    default: {
        findById: (_id) => {
            //
            if (_id == '1234') {
                return Promise.resolve({
                    _id: '1234',
                    username: 'sampleuser',
                    password: 'encryptedpassword',
                    firstname: 'myfirstane',
                    lastname: 'mylastname'
                });
            } 

            return Promise.reject('Error');
        }
    }
}));

jest.mock('@framework/libs/token', () => ({
    __esModule: true,
    verifyJWT: jest.fn((token) => {
        return token == 'samplevalidtoken' ? 
            {_id: '1234'} :
            {};
    })
}));

import { jwtVerify } from "@framework/middlewares/jwt-verify";

describe('Middlewares/jwt-verify', () => {
    //
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
        const next = (err) => {
            //
            expect(err).toBeTruthy();
            done();
        };

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