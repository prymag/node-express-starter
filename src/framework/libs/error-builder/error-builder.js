import buildMongooseError from "./mongoose";


function buildError(type, params) {
    //
    switch(type) {
        case 'mongoose':
            return buildMongooseError(params);
        default:
            throw new Error('Unknown error type to build');
    }
}

export default buildError;