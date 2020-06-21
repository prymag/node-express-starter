import { UserService } from "@modules/user";
import { compare } from "@core/libs/encryption";
import { NOT_FOUND } from "http-status-codes";
import { AppError } from "@core/libs/error-builder/application";

class AuthService extends UserService {

    constructor() {
        super();

        this.authenticate = this.authenticate.bind(this);
    }

    getUserNotFoundError() {
        //
        return new AppError()
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