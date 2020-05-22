import UserModel from "../models/user.model";
import { verifyJWT } from '@framework/libs/token';
import buildError from "@framework/libs/error-builder";
import HttpStatus from "http-status-codes";
function jwtVerify(req, res, next) {
    //
    const token = req.cookies.token;
    
    if (!token) {
        const err = buildError('app')
            .setTitle('Unauthorized')
            .setStatusCode(HttpStatus.UNAUTHORIZED);
        return next(err);
    }

    try {
        const data = verifyJWT(token);
        UserModel.findById(data._id)
            .then(user => {
                req.user = user;
                return next();
            }).catch(err => {
                return next(err);
            });
    } catch (e) {
        return next(e);
    }
    
}

export { jwtVerify };