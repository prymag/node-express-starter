import { MongooseDB } from "@db/mongoose";
import { Mongoose } from "mongoose";

describe('Mongoose connection', () => {
    // 
    let mongoose, connection, db;

    async function connect() {
        mongoose = new MongooseDB(process.env.MONGO_CONNECTION_STR, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
    
        connection = await mongoose.start();        
    }

    async function disconnect(done) {
        mongoose.stop(done);
    }

    it('Should connect and disconnect', async () => {
        //
        expect.assertions(2);

        const done = jest.fn();
        await connect();
        await disconnect(done);

        expect(connection).toBeInstanceOf(Mongoose);
        expect(done).toHaveBeenCalled();
    });

    it('Should throw an error', async() => {
        //

        mongoose = new MongooseDB('invalid_value', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
    
        expect(mongoose.start()).rejects.toBeInstanceOf(Error);
    });
});