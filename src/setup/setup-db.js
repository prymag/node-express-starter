import { MongooseDB } from '@db/mongoose';

export default async function() {
    //
    console.info('Connecting to db...');

    try {
        const defaultConnection = 'mongodb://localhost:27017/prymag-timetracker';
        const dbConStr = process.env.MONGO_CONNECTION_STR || defaultConnection;
        const dbOpts = {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        };
        const db = new MongooseDB(dbConStr, dbOpts);
        const connection = await db.start();
    } catch (e) {
        console.error(`Setup DB Error: ${e}`);
    }
}