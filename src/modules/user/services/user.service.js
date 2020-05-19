import UserModel from "@framework/models/user.model";
import buildError from "@framework/libs/error-builder/error-builder";
import { encrypt } from '@framework/libs/encryption/encryption';
import { mqpp } from "@framework/libs/mongoose-query-parser/mongoose-query-parser";

const MIN_LENGTH = process.env.ENC_MIN_LENGTH || 6;

class UserService {

    constructor() {
        this.save = this.save.bind(this);

        this._model = UserModel;
    }

    encryptPassword(body) {
        //
        if (body && body.hasOwnProperty('password')) {
            //
            if (body.password.length < MIN_LENGTH) {
                const param = {
                    model: UserModel,
                    errors: {
                        password: {
                            message: 'msg',
                            path: 'password',
                            type: 'length',
                            value: '***'   
                        }
                    }
                };
                return Promise.reject(buildError('mongoose', param));
            }


            return encrypt(body.password)
                .then(pass => {
                    // We spread it again so we do not return the same object
                    const newBody = {...body};
                    newBody.password = pass;
                    return Promise.resolve(newBody);
                });
        }

        return Promise.resolve(body);
    }

    all(queryParams = {}) {
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
        return this.encryptPassword(body)
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
        
        return this.encryptPassword(body)
            .then(newBody => this._model.findByIdAndUpdate(id, newBody, opts));
    }

    delete(id) {
        return this._model.deleteOne({_id: id});
    }

}

export default UserService;