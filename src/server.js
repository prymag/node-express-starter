import express from "express";
import routes from './route-loader';
import {MongooseDB} from './db/mongoose';

const app = express();
const port = 3000;

const dbConStr = 'mongodb://localhost:27017/prymag-timetracker';
const dbOpts = {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true
};
const db = new MongooseDB(dbConStr, dbOpts);

db.start()
.then((res) => {
    routes.load(app);
    app.get('/', (req, res) => res.send('Hello World!'));
    app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
}).catch (err => {
    console.log('Error:' + err);
});