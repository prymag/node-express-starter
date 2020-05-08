import * as response from "@libs/response/response";
import AuthService from '../services/auth.service';
import jwt from 'jsonwebtoken';

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
        this._service
            .authenticate(req.body.username, req.body.password)
            .then(user => {
                // We are receiving a node document
                // so we convert it to json to remove the password
                user = user.toJSON();
                delete user.password;

                const token = jwt.sign(user, 'secret');
                return res.json({user, token});
            })
            .catch(err => next(err));
    }
    
}

export default AuthController;