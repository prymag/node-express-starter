jest.mock("@modules/auth/services/auth.service");
jest.mock("@framework/libs/token");

import Service from "@modules/auth/services/auth.service";
import AuthController from "@modules/auth/controllers/auth.controller";
import * as token from '@framework/libs/token';

describe('Modules/auth/controllers/auth.controller', () => {
    //
    let controller, mockJson, mockSetStatus, next;

    beforeEach(() => {
        controller = new AuthController();
        mockJson = jest.fn().mockImplementation((response) => response);
        mockSetStatus = jest.fn();
        next = jest.fn();
    });

    afterEach(() => {
        // Clear all instances and calls to constructor and all methods:
        Service.mockClear();
        jest.restoreAllMocks();
    });
    

    it('REGISTER', async () => {
        //
        expect.assertions(4);

        const registrationDetails = {
            username: 'emilioA',
            email: 'emailA@mail.com',
            password: 'somepassword',
            firstname: 'emilio',
            lastname: 'aguinaldo'
        };

        const mockRegisteredUser = {...registrationDetails};
        mockRegisteredUser.password = 'encrypted';
        mockRegisteredUser._id = 'mongooseobjectid';

        const expectedResponse = {
            success: true,
            message: 'Success',
            data: mockRegisteredUser
        };

        const req = {
            body: registrationDetails
        };
        const res = {
            status: mockSetStatus,
            json: mockJson
        };

        jest.spyOn(Service.prototype, "save").mockImplementation(() => Promise.resolve(mockRegisteredUser));
        
        
        const result = await controller.register(req, res, next);

        expect(result).toEqual(expectedResponse);
        expect(mockSetStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith(expectedResponse);
        expect(next).not.toHaveBeenCalled();
    });

    it("LOGIN", async () => {
        //
        const mockUser = {
            _id: 'mongooseobjectid',
            username: 'andres',
            password: 'encrypted',
            firstname: 'andres',
            lastname: 'bonifacion'
        };
        const mockToJson = jest.fn().mockImplementation(() => mockUser);
        const userObj = {
            toJSON: mockToJson
        };

        const req = {
            body: {
                username: 'andres',
                password: 'bonifacio03'
            }
        };
        const mockSetCookie = jest.fn().mockImplementation((name, token, opts) => {});
        const res = {
            status: mockSetStatus,
            json: mockJson,
            cookie: mockSetCookie
        };
        const mockToken = "randomstringsimulatingmocktoken";

        jest.spyOn(Service.prototype, "authenticate").mockReturnValue(Promise.resolve(userObj));
        jest.spyOn(token, "signJWT").mockReturnValue(mockToken);

        const mockUserData = {...mockUser};
        delete mockUserData.password;

        const expectedResponse = {
            success: true,
            message: 'Success',
            data: {
                user: mockUser,
                token: mockToken
            }
        };
        const result = await controller.login(req, res, next);

        expect(result).toEqual(expectedResponse);
        expect(mockToJson).toHaveBeenCalled();
        expect(token.signJWT).toHaveBeenCalled();
        expect(mockSetCookie).toHaveBeenCalledWith('token', mockToken,  {httpOnly: true});
        expect(next).not.toHaveBeenCalled();
    });

    it("Should call next on error", async () => {
        //
        let req = {};
        const res = {};

        // REGISTER
        let mockError = new Error("Cannot register");
        jest.spyOn(Service.prototype, "save").mockReturnValue(Promise.reject(mockError));        
        await controller.register(req, res, next);
        expect(next).toHaveBeenCalledWith(mockError);
        
        // LOGIN
        mockError = new Error("Cannot login");
        jest.spyOn(Service.prototype, "authenticate").mockReturnValue(Promise.reject(mockError));

        req = {
            body: {
                username: 'diosdado',
                password: 'macapagal233'
            }
        };
        await controller.login(req, res, next);
        expect(next).toHaveBeenCalledWith(mockError);
    });


});