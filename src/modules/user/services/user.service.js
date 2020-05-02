import UserModel from '../models/user.model';
import hash from '../helpers/hasher';

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

    all() {
        
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

}

export default UserService;