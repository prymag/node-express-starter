import UserModel from "../models/user.model";
import { verifyJWT } from '@framework/libs/token';

function jwtVerify(req, res, next) {
    //
    const token = req.cookies.token;
    
    if (!token) {
        return next(new Error('Unauthorized'));
    }
    const data = verifyJWT(token);
    
    UserModel.findById(data._id)
        .then(user => {
            req.user = user;
            next();
        }).catch(err => {
            next(err);
        });
}

export { jwtVerify };