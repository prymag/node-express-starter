import buildMongooseError from "./mongoose";
import { AppError } from './application';

function buildError(type, params) {
    //
    switch(type) {
        case 'mongoose':
            return buildMongooseError(params);
        case 'app':
            return new AppError();
        default:
            throw new Error('Unknown error type to build');
    }
}

export default buildError;
export { AppError };