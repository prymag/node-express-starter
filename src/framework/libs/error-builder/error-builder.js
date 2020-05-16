import buildMongooseError from "./mongoose";


function buildError(type, params) {
    //
    switch(type) {
        case 'mongoose':
            return buildMongooseError(params);
    }
}

export default buildError;