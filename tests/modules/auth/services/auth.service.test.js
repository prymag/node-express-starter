jest.mock('@framework/models/user.model');
jest.mock('@framework/libs/encryption');

import AuthService from "@modules/auth/services/auth.service";
import UserModel from "@framework/models/user.model";
import * as encryption from "@framework/libs/encryption";
import * as errorBuilder from "@framework/libs/error-builder";

describe('Modules/Auth/Services/AuthService', () => {
    //
    const service = new AuthService();

    afterEach(() => {
        jest.restoreAllMocks();
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

    it('should get user not found error', () => {
        //
        // https://blog.bguiz.com/2017/mocking-chained-apis-jest/
        const mockSetMsg = jest.fn().mockReturnThis();
        const mockSetData = jest.fn().mockReturnThis();
        const mockSetStatusCode = jest.fn().mockReturnThis();
        const mockAppError = {
            setMsg: mockSetMsg,
            setData: mockSetData,
            setStatusCode: mockSetStatusCode
        };

        const spyBuilder = jest.spyOn(errorBuilder, 'default').mockReturnValue(mockAppError);

        const result = service.getUserNotFoundError();
        expect(result).toEqual(mockAppError);

        expect(spyBuilder).toHaveBeenCalledWith('app');
        expect(mockSetMsg).toHaveBeenCalledWith('User not found');
        expect(mockSetData).toHaveBeenCalledWith({eType: 'notFound', eDetail: 'userNotFound'});
        expect(mockSetStatusCode).toHaveBeenCalledWith(404);        
    });
});
