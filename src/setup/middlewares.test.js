jest.mock('cors');


import setupMiddlewares from './middlewares';
import cors from "cors";


describe('Setup middlewares', () => {
    //
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('Should setup correctly', () => {
        //
        const mockApp = {
            use: jest.fn()
        };
        // Prevent info logging on test
        jest.spyOn(console, 'info').mockReturnValue(() => '');

        setupMiddlewares(mockApp);

        expect(mockApp.use).toHaveBeenCalledTimes(4);
        expect(mockApp.use).toHaveBeenCalledWith(cors());
    });

    it('Should handle error', () => {
        //
        const mockApp = {
            use: jest.fn().mockImplementation(() => { throw new Error('Mock Error'); })
        };
        // Prevent info logging on test
        jest.spyOn(console, 'info').mockReturnValue(() => '');

        const logErrorSpy = jest.spyOn(console, 'error').mockReturnValue(() => {});
        
        setupMiddlewares(mockApp);

        expect(logErrorSpy).toHaveBeenCalledWith('Setup Middlewares Error: Error: Mock Error');
    });
});