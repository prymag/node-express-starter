import bcrypt from 'bcrypt';
import { Error } from "mongoose";
import UserModel from '../models/user.model';

const SALT_ROUNDS = 3;
const MIN_PASSWORD = 6;

function validatePassword(password) {
    //
    if (password.length > MIN_PASSWORD) {
        return;
    }

    const error = new Error.ValidationError(new UserModel());
    const errObj = {
        type:'length', 
        path:'password', 
        message: `Password should be atleast ${MIN_PASSWORD} characters.`
    };

    error.errors.password = new Error.ValidatorError(errObj);
    return error;
}   

function hash(password) {
    //
    const isValid = validatePassword(password);
    if (isValid instanceof Error.ValidationError) {
        return Promise.reject(isValid);
    }

    return bcrypt.genSalt(SALT_ROUNDS)
        .then((salt) => bcrypt.hash(password, salt))
        .then((hash) => Promise.resolve(hash));
}

export default hash;