import UserModel from '../models/user.model';
import { encrypt } from '../helpers/encryption';
import { mqpp } from "@framework/libs/mongoose-query-parser/mongoose-query-parser";

class UserService {

    constructor() {
        this.save = this.save.bind(this);

        this._model = UserModel;
    }

    hashPassword(body) {
        //
        if (body && body.hasOwnProperty('password')) {
            return encrypt(body.password)
                .then(pass => {
                    body.password = pass;
                    return Promise.resolve(body);
                });
        }

        return Promise.resolve(body);
    }

    all(queryParams) {
        //
        const mqpOpts = {
            fields_to_search: ['username', 'firstname', 'lastname', 'email'],
        };
        const {query, limit, page} = mqpp(queryParams, mqpOpts);
        const opts = {limit, page};

        return this._model.paginate(query, opts);
    }

    get(id) {
        //
        return this._model.findById(id, '-password');
    }

    save(body) {
        //
        return this.hashPassword(body)
            .then(newBody =>{
                let model = new this._model(newBody);
                return model.save();
            })
            .then((user) => Promise.resolve(user));
    }

    update(id, body) {
        // https://github.com/blakehaswell/mongoose-unique-validator#find--updates
        const opts = {
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true,
            context: 'query',
            new: true
        };
        
        return this.hashPassword(body)
            .then(newBody => this._model.findByIdAndUpdate(id, newBody, opts));
    }

    delete(id) {
        return this._model.deleteOne({_id: id});
    }

}

export default UserService;