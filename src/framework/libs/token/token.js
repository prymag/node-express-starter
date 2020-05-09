import jwt from 'jsonwebtoken';

const SECRET_KEY = 'secret_key';

function signJWT(data) {
    return jwt.sign(data, SECRET_KEY);
}

function verifyJWT(token) {
    return jwt.verify(token, SECRET_KEY);
}

export { signJWT, verifyJWT };