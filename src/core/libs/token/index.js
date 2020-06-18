import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'jwtsecretkey';

function signJWT(data) {
    return jwt.sign(data, SECRET_KEY);
}

function verifyJWT(token) {
    return jwt.verify(token, SECRET_KEY);
}

export { signJWT, verifyJWT };