import dotenv from 'dotenv';
import setupDotenv from './dotenv';

describe('Setup Dotenv', () => {
    //
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('Should setup correctly', () => {
        //

        const dotenvSpy = jest.spyOn(dotenv, 'config').mockReturnValue({error: false});
        setupDotenv();

        expect(dotenvSpy).toHaveBeenCalled();
        
    });

    it('Should handle error', () => {
        //
        const dotenvSpy = jest.spyOn(dotenv, 'config').mockReturnValue({error: 'Sample error'});
        const consoleSpy = jest.spyOn(console, 'error').mockReturnValue(() => '');
        setupDotenv();

        expect(dotenvSpy).toHaveBeenCalled();
        expect(consoleSpy).toHaveBeenCalledWith('DotEnv Error: Sample error');
    });
});

