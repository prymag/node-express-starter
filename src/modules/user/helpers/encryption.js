import bcrypt from 'bcrypt';
import { Error } from "mongoose";
import UserModel from '../models/user.model';

const SALT_ROUNDS = 3;
const MIN_LENGTH = 6;

function validateStr(str, fieldName) {
    //
    if (str.length > MIN_LENGTH) {
        return;
    }

    const error = new Error.ValidationError(new UserModel());
    const errObj = {
        type:'length', 
        path:fieldName, 
        message: `The \`${fieldName}\` field should be atleast ${MIN_LENGTH} characters.`
    };

    error.errors.password = new Error.ValidatorError(errObj);
    return error;
}   

function encrypt(str, fieldName = 'password') {
    //
    const isValid = validateStr(str, fieldName);
    if (isValid instanceof Error.ValidationError) {
        return Promise.reject(isValid);
    }

    return bcrypt.genSalt(SALT_ROUNDS)
        .then((salt) => bcrypt.hash(password, salt))
        .then((hash) => Promise.resolve(hash));
}

function decrypt(hash, str) {
    return bcrypt.compare(hash, str);
}

export { encrypt, decrypt };