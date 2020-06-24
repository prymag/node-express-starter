import { MongooseDB } from '@db/mongoose';

export default async function() {
    //
    console.info('Connecting to db...');

    try {
        const dbConStr = 'mongodb://localhost:27017/prymag-timetracker';
        const dbOpts = {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        };
        const db = new MongooseDB(process.env.MONGO_CONNECTION_STR || dbConStr, dbOpts);
        const connection = await db.start();
    } catch (e) {
        console.error(`Setup DB Error: ${e}`);
    }
}