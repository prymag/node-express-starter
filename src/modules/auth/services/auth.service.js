import { UserService } from "@modules/user/user";
import { compare } from "@framework/libs/encryption";

class AuthService extends UserService {

    constructor() {
        super();

        this.authenticate = this.authenticate.bind(this);
    }

    async authenticate(username, password) {
        //
        if (!username || !password || username == '' || password == '') {
            return Promise.reject('Please provide a username/password');
        }

        const user = await this._model.findOne({username});
        
        if (!user) {
            return Promise.reject('User not found');
        }
        
        return compare(user.password, password)
            .then(result => {
                //            
                return result ? 
                    Promise.resolve(user) : 
                    Promise.reject('User not found');
            });
    }

    register(body) {
        //
        return this.save(body);
    }

}

export default AuthService;