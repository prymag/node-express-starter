jest.mock('@framework/models/user.model');
jest.mock('@framework/libs/encryption');

import AuthService from "@modules/auth/services/auth.service";
import UserModel from "@framework/models/user.model";
import * as encryption from "@framework/libs/encryption";

describe('Modules/Auth/Services/AuthService', () => {
    //
    const service = new AuthService();

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('Should throw an error', () => {
        //
        expect.assertions(4);
        jest.spyOn(encryption, 'compare').mockReturnValue(Promise.resolve(false));
        expect(service.authenticate()).rejects.toBe('Please provide a username/password');
        expect(service.authenticate('', '')).rejects.toBe('Please provide a username/password');
        
        jest.spyOn(UserModel, 'findOne').mockReturnValue(Promise.resolve());
        expect(service.authenticate('invalidusername', 'invalidpassword')).rejects.toBe('User not found');
        
        const mockValidUser = {
            _id: 'mongooseobjectid',
            username: 'validusername',
            password: 'encrypted',
            firstname: 'firstname',
            lastname: 'lastname'
        };
        jest.spyOn(UserModel, 'findOne').mockReturnValue(Promise.resolve(mockValidUser));
        jest.spyOn(encryption, 'compare').mockReturnValue(Promise.resolve(false));
        expect(service.authenticate('validusername', 'invalidpassword')).rejects.toBe('User not found');
    });

    it('Should authenticate a user', () => {
        //
        const expected = {
            _id: 'mongooseobjectid',
            username: 'validusername',
            password: 'encrypted',
            firstname: 'myfirstname',
            lastname: 'mylastname'
        };

        jest.spyOn(encryption, 'compare').mockReturnValue(Promise.resolve(true));
        jest.spyOn(UserModel, 'findOne').mockReturnValue(Promise.resolve(expected));
        expect(service.authenticate('validusername', 'rawpassword')).resolves.toEqual(expected);
    });


    it('Should register a user', () => {
        //
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
        expect(service.register(body)).resolves.toEqual(expected);
    });
});
