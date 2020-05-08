import { UserService, UserHelper } from "@modules/user/user";

class AuthService extends UserService {

    constructor() {
        super();

        this.authenticate = this.authenticate.bind(this);
    }

    async authenticate(username, password) {
        //
        const user = await this._model.findOne({username});
        
        if (!username || !password) {
            return Promise.reject('Please provide a username/password');
        }

        if (!user) {
            return Promise.reject('User not found');
        }
        
        return UserHelper.compare(user.password, password)
            .then(result => {
                console.log(result);
                return result ? Promise.resolve(user) : Promise.reject('User not found');

            });
    }

}

export default AuthService;