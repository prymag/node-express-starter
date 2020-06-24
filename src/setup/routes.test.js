import setupRoutes from './routes';

describe('Setup routes', () => {
    //
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('Should setup properly', () => {
        //
        const mockApp = {
            use: jest.fn(),
            get: jest.fn()
        };
        // Prevent info logging on test
        jest.spyOn(console, 'info').mockReturnValue(() => '');
        
        setupRoutes(mockApp);

        expect(mockApp.use).toHaveBeenCalled();
    });

    it('Should setup default route', () => {
        //
        const req = {};
        const res = {json: jest.fn()};
        const mockApp = {
            use: jest.fn(),
            get: jest.fn().mockImplementation((path, callback) => {
                // Mock implementation of callback
                // for coverage
                return callback(req, res);
            })
        };
        // Prevent info logging on test
        jest.spyOn(console, 'info').mockReturnValue(() => '');

        setupRoutes(mockApp);

        expect(mockApp.get).toHaveBeenCalledWith('/', expect.any(Function));
        expect(res.json).toHaveBeenCalled();
    });

    it('Should handle error', () => {
        //
        const mockApp = {
            use: jest.fn().mockImplementation(() => { throw new Error('Mock Error'); }),
            get: jest.fn()
        };
        // Prevent info logging on test
        jest.spyOn(console, 'info').mockReturnValue(() => '');

        const logErrorSpy = jest.spyOn(console, 'error').mockReturnValue(() => {});
        
        setupRoutes(mockApp);

        expect(logErrorSpy).toHaveBeenCalledWith('Routes Setup Error: Error: Mock Error');
    });
});