import UserModel from '../models/user.model';
import hash from '../helpers/hasher';
import { mqpp } from "@libs/mongoose-query-parser/mongoose-query-parser";

class UserService {

    constructor() {
        this.save = this.save.bind(this);
    }

    hashPassword(body) {
        //
        if (body && body.hasOwnProperty('password')) {
            return hash(body.password)
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

        return UserModel.paginate(query, opts);
    }

    get(id) {
        //
        return UserModel.findById(id, '-password');
    }

    save(body) {
        //
        return this.hashPassword(body)
            .then(newBody =>{
                let model = new UserModel(newBody);
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
            .then(newBody => UserModel.findByIdAndUpdate(id, newBody, opts));
    }

    delete(id) {
        return UserModel.deleteOne({_id: id});
    }

}

export default UserService;