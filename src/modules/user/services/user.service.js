import UserModel from '../models/user.model';

class UserService {

    all() {
        
    }

    get(id) {
        //
        return UserModel.findById(id, '-password');
    }

    save(props) {
        //
        let model = new UserModel(props);
        
        return model.save()
            .then((user) => Promise.resolve(user))
            .catch((err) => Promise.reject(err));
    }

    update(id, props) {
        //
        return UserModel.findByIdAndUpdate(id, props);
    }

}

export default UserService;