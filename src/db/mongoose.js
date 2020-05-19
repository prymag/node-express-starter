import mongoose from 'mongoose';

class MongooseDB {

    constructor(connectionStr, opts) {
        this._conectionStr = connectionStr;
        this._opts = opts;
    }

    start(){
        //
        const con = mongoose.connect(this._conectionStr, this._opts);
        return Promise.resolve(con);
        //
    }

    stop(cb) {
        //
        const result = mongoose.disconnect();
        cb();
        return result;
        //
    }
}

export {MongooseDB};