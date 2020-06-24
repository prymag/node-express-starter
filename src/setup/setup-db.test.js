jest.mock('@db/mongoose');

import dotenv from 'dotenv';
import { MongooseDB } from '@db/mongoose';
import setupDb from './setup-db';

describe('Setup DB', () => {
    //
    beforeAll(() => {
        dotenv.config();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('Should setup properly', () => {
        //
        expect.assertions(2);

        jest.spyOn(console, 'info').mockReturnValue(() => '');

        const connectionStr = process.env.MONGO_CONNECTION_STR;
        
        const dbOpts = {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        };
        setupDb();

        expect(MongooseDB).toHaveBeenCalledWith(connectionStr, dbOpts);
        expect(MongooseDB.prototype.start).toHaveBeenCalled();
    });

    it('Should fallback connection string', () => {
        //
        jest.spyOn(console, 'info').mockReturnValue(() => '');

        const connectionStr = 'mongodb://localhost:27017/prymag-timetracker';
        delete process.env.MONGO_CONNECTION_STR;

        setupDb();
        const dbOpts = {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        };
        setupDb();

        expect(MongooseDB).toHaveBeenCalledWith(connectionStr, dbOpts);
    });

    it('Should handle error', () => {
        // Prevent info logging on test
        jest.spyOn(console, 'info').mockReturnValue(() => '');
        jest.spyOn(MongooseDB.prototype, 'start').mockImplementation(() => { throw new Error('Mock Error');});
        
        const logErrorSpy = jest.spyOn(console, 'error').mockReturnValue(() => {});
        
        setupDb();

        expect(logErrorSpy).toHaveBeenCalledWith('Setup DB Error: Error: Mock Error');
    });
});