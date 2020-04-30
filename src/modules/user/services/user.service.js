import UserModel from '../models/user.model';

class UserService {

    all() {
        
    }

    save(props) {
        let model = new UserModel(props);

        return model.save()
            .then((user) => Promise.resolve(user))
            .catch((err) => Promise.reject(err));
    }

    update() {

    }

}

export default UserService;