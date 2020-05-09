import { UserService } from "@modules/user/user";
import { compare } from "@framework/libs/encryption/encryption";

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
        
        return compare(user.password, password)
            .then(result => {
                console.log(result);
                return result ? Promise.resolve(user) : Promise.reject('User not found');

            });
    }

}

export default AuthService;