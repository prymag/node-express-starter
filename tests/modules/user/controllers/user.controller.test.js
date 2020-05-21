jest.mock("@modules/user/services/user.service");

import UserController from "@modules/user/controllers/user.controller";
import Service from "@modules/user/services/user.service";

describe("Modules/User/Controller/User", () => {
    //
    let controller, mockJson, mockSetStatus;

    beforeEach(() => {
        controller = new UserController();
        mockJson = jest.fn().mockImplementation((response) => response);
        mockSetStatus = jest.fn();
    });

    afterEach(() => {
        // Clear all instances and calls to constructor and all methods:
        Service.mockClear();
        jest.restoreAllMocks();
    });


    it('INDEX', async () => {
        //
        expect.assertions(5);

        const mockSearchedDocuments = {
            docs: {
                // .. documents will be listed
                // .. there are other properties here
                // .. but for sake of testing this should be fine.
            }
        };
        const expectedResponse = {
            success: true,
            message: 'Success',
            data: mockSearchedDocuments,
        };

        // Set the request, response, and next
        // for express parameters
        const req = {query: 's=searchvalue'};
        const res = {
            status: mockSetStatus,
            json: mockJson
        };
        const next = jest.fn();

        // Mock the implementation for the `all` function
        // of the UserService class
        const mockAll = jest.fn(() => Promise.resolve(mockSearchedDocuments));
        jest.spyOn(Service.prototype, "all").mockImplementation((qp) => {
            return mockAll();
        });

        const result = await controller.index(req, res, next);

        expect(mockSetStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith(expectedResponse);
        expect(result).toEqual(expectedResponse);
        expect(mockAll).toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it('STORE', async () => {
        //
        expect.assertions(4);

        const createdUser = {
            _id: 'mongooseobjectid',
            username: 'username@mail.com',
            password: 'encrypted',
            firstname: 'firstname',
            lastname: 'lastname'
        };

        const expectedResponse = {
            success: true,
            message: 'Success',
            data: createdUser
        };

        const mockBody = {
            username: 'username@mail.com',
            password: '12312l',
            firstname: 'firstname',
            lastname: 'lastname'
        };
        
        jest.spyOn(Service.prototype, "save").mockImplementation((body) => {
            //
            const user = {...body};
            user.password = 'encrypted';
            user._id = 'mongooseobjectid';
            
            return Promise.resolve(user);
        });

        const req = {body: mockBody};
        const res = {
            status: mockSetStatus,
            json: mockJson
        };
        
        const next = jest.fn();
        const result = await controller.store(req, res, next);
        
        expect(result).toEqual(expectedResponse);
        expect(mockJson).toHaveBeenCalledWith(expectedResponse);
        expect(mockSetStatus).toHaveBeenCalledWith(200);
        expect(next).not.toHaveBeenCalled();
    });

    it('SHOW', async () => {
        //
        expect.assertions(4);

        const mockUser = {
            _id: 'mongooseobjectid',
            username: 'myusername',
            password: 'encryptedpassword',
            firstname: 'jhon',
            lastname: 'doe'
        };
        const expectedResponse = {
            success: true,
            message: 'Success',
            data: mockUser,
        };

        const req = {params: {id: 'mongooseobjectid'}};
        const res = {
            status: mockSetStatus,
            json: mockJson
        };
        const next = jest.fn();

        jest.spyOn(Service.prototype, "get").mockImplementation((id) => Promise.resolve(mockUser));

        const result = await controller.show(req, res, next);
        
        expect(next).not.toHaveBeenCalled();
        expect(mockSetStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith(expectedResponse);
        expect(result).toEqual(expectedResponse);
    });

    it('UPDATE', async () => {
        //
        const mockUpdatedUser = {
            _id: 'mongooseobjectid',
            username: 'updatedusername',
            password: 'encrypted',
            firstname: 'myfirstname',
            lastname: 'updatedlastname'
        };

        const expectedResponse = {
            success: true,
            message: 'Success',
            data: mockUpdatedUser,
        };

        const req = {
            params: {id: 'mongoooseobjectid'},
            body: {username: 'updatedusername', lastname: 'updatedlastname'}
        };
        const res = {
            status: mockSetStatus,
            json: mockJson
        };
        const next = jest.fn();

        jest.spyOn(Service.prototype, "update").mockImplementation((id, body) => Promise.resolve(mockUpdatedUser));

        const result = await controller.update(req, res, next);

        expect(mockSetStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith(expectedResponse);
        expect(result).toEqual(expectedResponse);
        expect(next).not.toHaveBeenCalled();
    });

    it('DELETE', async() => {
        //
        expect.assertions(4);

        const mockDeleteResult = {
            deletedCount: 1
            // ... there are more objects here
        };
        const expectedResponse = {
            success: true,
            message: 'Success',
            data: mockDeleteResult,
        };

        const req = {params: {id: 'mongoooseobjectid'}};
        const res = {
            status: mockSetStatus,
            json: mockJson
        };
        const next = jest.fn();

        jest.spyOn(Service.prototype, "delete").mockImplementation((id, body) => Promise.resolve(mockDeleteResult));

        const result = await controller.delete(req, res, next);

        expect(mockSetStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith(expectedResponse);
        expect(result).toEqual(expectedResponse);
        expect(next).not.toHaveBeenCalled();
    });

    it('Should call `next` if errors are encountered ', async () => {
        //
        expect.assertions(5);

        // req, res, next setup
        let req = {};
        const res = {};
        const next = jest.fn();

        let mockError;

        // Index
        mockError = new Error('Testing error');
        jest.spyOn(Service.prototype, "all").mockImplementation((qp) => {
            return Promise.reject(mockError);
        });
        
        await controller.index(req, res, next);
        expect(next).toHaveBeenCalledWith(mockError);

        // Store
        mockError = new Error('Error saving user');
        jest.spyOn(Service.prototype, "save").mockImplementation(() => Promise.reject(mockError));

        await controller.store(req, res, next);
        expect(next).toHaveBeenCalledWith(mockError);

        // Show
        req = {params: {id: 'mongooseobjectid'}};
        mockError = new Error('Error getting user');
        jest.spyOn(Service.prototype, "get").mockImplementation((id) => Promise.reject(mockError));
    
        await controller.show(req, res, next);
        expect(next).toHaveBeenCalledWith(mockError);
        req = {}; // restore

        // Update
        req = {
            params: {id:'mongooseobjectid'},
            body: {username: 'updatedusername',password: 'updatedpassword'}
        };
        mockError = new Error('Error updating user');
        jest.spyOn(Service.prototype, "update").mockImplementation((id, body) => Promise.reject(mockError));

        await controller.update(req, res, next);
        expect(next).toHaveBeenCalledWith(mockError);
        req = {}; //restore

        // Delete
        req = {params: {id: 'mongooseobjectid'}};
        mockError = new Error('Error deleting user');
        jest.spyOn(Service.prototype, "delete").mockImplementation((id) => Promise.reject(mockError));

        await controller.delete(req, res, next);
        expect(next).toHaveBeenCalledWith(mockError);
        req = {}; // restore
    });

});