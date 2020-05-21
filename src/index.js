import express from "express";
import routes from './route-loader';
import { MongooseDB } from './db/mongoose';
import { ErrorHandler } from "@framework/middlewares/error-handler";
import cookieparser from "cookie-parser";
import { config } from "dotenv";

config();

const app = express();
const port = process.env.SERVER_PORT || 3000;

app.use(express.json());
app.use(cookieparser());

const dbConStr = 'mongodb://localhost:27017/prymag-timetracker';
const dbOpts = {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
};
const db = new MongooseDB(process.env.MONGO_CONNECTION_STR || dbConStr, dbOpts);

db.start()
.then((res) => {
    routes.load(app);
    app.use(ErrorHandler);
    app.get('/', (req, res) => res.json({}));
    app.listen(port, () => console.log(`App is listening at: http://localhost:${port}`));
}).catch (err => {
    console.log('Error:' + err);
});