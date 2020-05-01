import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;

let UserSchema = new Schema({
    username    : { type: String, required: true, max: 100, index: {unique: true}},
    password    : { type: String, required: true},
    firstname   : { type: String },
    lastname    : { type: String },
    email       : { type: String, required: true},
});


UserSchema.post('save', (user, next) => {
    //
    bcrypt.genSalt(3)
        .then((salt) => bcrypt.hash(user.password, salt))
        .then((hash) => {
            user.password = hash;
            user.save();
            next();
        }).catch((error) => next(error));
});

UserSchema.plugin(uniqueValidator);

// Export the model
export default mongoose.model('User', UserSchema);