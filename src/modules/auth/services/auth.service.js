import { UserService } from "@modules/user/user";
import { compare } from "@framework/libs/encryption";
import buildError from "@framework/libs/error-builder";
import { NOT_FOUND } from "http-status-codes";

class AuthService extends UserService {

    constructor() {
        super();

        this.authenticate = this.authenticate.bind(this);
    }

    getUserNotFoundError() {
        //
        return buildError('app')
            .setMsg('User not found')
            .setStatusCode(NOT_FOUND)
            .setData({eType: 'notFound', eDetail: 'userNotFound'});
    }

    async authenticate(username, password) {
        //
        if (!username || !password || username == '' || password == '') {
            return Promise.reject('Please provide a username/password');
        }

        const user = await this._model.findOne({username});
        
        if (!user){
            return Promise.reject(this.getUserNotFoundError());
        }
        
        return compare(user.password, password)
            .then(result => {
                //            
                return result ? 
                    Promise.resolve(user) : 
                    Promise.reject(this.getUserNotFoundError());
            });
    }

    register(body) {
        //
        return this.save(body);
    }

}

export default AuthService;