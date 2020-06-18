import bcrypt from 'bcrypt';

const SALT_ROUNDS = process.env.ENC_ROUNDS || 3;

function encrypt(str) {
    //
    return bcrypt.genSalt(SALT_ROUNDS)
        .then((salt) => bcrypt.hash(str, salt))
        .then((hash) => Promise.resolve(hash));
}

function compare(hash, str) {
    return bcrypt.compare(str, hash);
}

export { encrypt, compare };