import mongoose from 'mongoose';

class MongooseDB {

    constructor(connectionStr, opts) {
        this._connection = false;
        this._conectionStr = connectionStr;
        this._opts = opts;
    }

    start(){
        //
        if(this._connection) {
            return Promise.resolve(this._connection);
        }
        this._connection = mongoose.connect(this._conectionStr, this._opts);

        return Promise.resolve(this._connection);
    }

    stop(callback) {
        //
        if (this._connection) {
            _connection.disconnect();
            _connection = undefined;
            callback();
            return Promise.resolve(true);
        }

        callback();
        return Promise.reject('Not connected');
    }
}

export {MongooseDB};