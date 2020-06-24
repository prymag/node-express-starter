jest.mock('@core/models/user.model');
jest.mock('@core/libs/encryption');
jest.mock('@core/libs/error-builder/application');

import AuthService from "@modules/auth/services/auth.service";
import UserModel from "@core/models/user.model";
import * as encryption from "@core/libs/encryption";
import { AppError } from "@core/libs/error-builder/application";
import { NOT_FOUND } from "http-status-codes";

describe('@modules/auth/services/auth.service', () => {
    //
    const service = new AuthService();

    // https://blog.bguiz.com/2017/mocking-chained-apis-jest/
    const mockMethods =  {
        constructor: jest.fn().mockReturnThis(),
        setMsg: jest.fn().mockReturnThis(),
        setData: jest.fn().mockReturnThis(),
        setStatusCode: jest.fn().mockReturnThis()
    };

    beforeEach(() => {
        AppError.mockImplementation(() => mockMethods);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should get user not found error', () => {
        //
        const expectedData = {eType: 'notFound', eDetail: 'userNotFound'};

        const result = service.getUserNotFoundError();
        
        expect(AppError).toHaveBeenCalled();
        expect(mockMethods.setMsg).toHaveBeenCalledWith('User not found');
        expect(mockMethods.setData).toHaveBeenCalledWith(expectedData);
        expect(mockMethods.setStatusCode).toHaveBeenCalledWith(NOT_FOUND);
        expect(result).toEqual(mockMethods);
    });

    it('Should throw an error', async() => {
        //
        const expectedUserNotFound = {
            msg: 'User not found',
            statusCode: 404,
            data: {
                eType: 'notFound',
                eDetail: 'userNotFound'
            }
        };

        expect.assertions(4);
        jest.spyOn(encryption, 'compare').mockReturnValue(Promise.resolve(false));
        await expect(service.authenticate()).rejects.toBe('Please provide a username/password');
        await expect(service.authenticate('', '')).rejects.toBe('Please provide a username/password');
        
        jest.spyOn(UserModel, 'findOne').mockReturnValue(Promise.resolve());
        // Mock getUserNotFoundErro
        // the function has already been tested above
        jest.spyOn(service, 'getUserNotFoundError').mockReturnValue(expectedUserNotFound);

        await expect(service.authenticate('invalidusername', 'invalidpassword')).rejects.toEqual(expectedUserNotFound);
        
        const mockValidUser = {
            _id: 'mongooseobjectid',
            username: 'validusername',
            password: 'encrypted',
            firstname: 'firstname',
            lastname: 'lastname'
        };
        jest.spyOn(UserModel, 'findOne').mockReturnValue(Promise.resolve(mockValidUser));
        jest.spyOn(encryption, 'compare').mockReturnValue(Promise.resolve(false));

        
        await expect(service.authenticate('validusername', 'invalidpassword')).rejects.toEqual(expectedUserNotFound);
    });

    it('Should authenticate a user', () => {
        //
        expect.assertions(1);
        const expected = {
            _id: 'mongooseobjectid',
            username: 'validusername',
            password: 'encrypted',
            firstname: 'myfirstname',
            lastname: 'mylastname'
        };

        jest.spyOn(encryption, 'compare').mockReturnValue(Promise.resolve(true));
        jest.spyOn(UserModel, 'findOne').mockReturnValue(Promise.resolve(expected));

        return expect(service.authenticate('validusername', 'rawpassword')).resolves.toEqual(expected);
    });

    it('Should register a user', () => {
        //
        expect.assertions(1);
        const body = {
            username: 'validusername',
            password: 'mypassword',
            firstname: 'myfirstname',
            lastname: 'mylastname'
        };

        const expected = {
            _id: 'mongooseobjectid',
            username: 'validusername',
            password: 'encrypted',
            firstname: 'myfirstname',
            lastname: 'mylastname'
        };

        // http://www.gjermundbjaanes.com/how-to-mock-and-spy-on-a-mongoose-model/
        jest.spyOn(encryption, 'encrypt').mockReturnValue(Promise.resolve('encrypted'));
        jest.spyOn(UserModel.prototype, 'save').mockReturnValueOnce(Promise.resolve(expected));
        return expect(service.register(body)).resolves.toEqual(expected);
    });

    
});
