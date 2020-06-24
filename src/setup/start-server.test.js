import startServer from "./start-server";
import { ErrorHandler } from "@core/middlewares/error-handler";

describe('Start Server', () => {

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('Should start propery', () => {
        //
        const mockApp = {
            listen: jest.fn().mockImplementation((port, callback) => {
                return callback();
            }),
            use: jest.fn()
        };
        const port = process.env.SERVER_PORT || 3000;
        const logInfoSpy = jest.spyOn(console, 'log').mockReturnValue(() => '');

        startServer(mockApp);

        expect(mockApp.listen).toHaveBeenCalledWith(port, expect.any(Function));
        expect(mockApp.use).toHaveBeenCalledWith(ErrorHandler);
        expect(logInfoSpy).toHaveBeenCalledWith(`App is listening at: http://localhost:${port}`);
    });

    it('Should handle error', () => {
        //
        const mockApp = {
            listen: jest.fn().mockImplementation((port, callback) => {
                return callback(new Error('Mock Error'));
            }),
            use: jest.fn()
        };

        // Spy and prevent logging
        const logErrorSpy = jest.spyOn(console, 'error').mockReturnValue(() => '');

        startServer(mockApp);

        expect(logErrorSpy).toHaveBeenCalledWith('App Error: Error: Mock Error');
    });

});