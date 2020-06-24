import * as response from "@core/libs/response";
import { signJWT } from '@core/libs/token';
import AuthService from '../services/auth.service';

class AuthController {
    //
    constructor() {
        this._service = new AuthService();

        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
    }

    register(req, res, next) {
        //
        return this._service
            .save(req.body)
            .then(success => response.success(res, success))
            .catch(err => next(err));
    }

    login(req, res, next) {
        //
        return this._service
            .authenticate(req.body.username, req.body.password)
            .then(user => {
                // We are receiving a node document
                // so we convert it to json to remove the password
                user = user.toJSON();
                delete user.password;

                const token = signJWT(user);
                const cookieOpts = {
                    httpOnly: true,
                    signed: true,
                    sameSite: true
                };
                res.cookie('access_token', token, cookieOpts);

                return response.success(res, {user, token});
            })
            .catch(err => next(err));
    }
    
}

export default AuthController;