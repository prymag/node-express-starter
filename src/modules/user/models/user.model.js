import mongoose from 'mongoose';
import validator from 'validator';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;

const emailValidator = [
    validator.isEmail,
    'Invalid Email',
    'email'
];
const UserSchema = new Schema({
    username    : { type: String, required: true, max: 50, index: {unique: true}},
    password    : { type: String, required: true},
    firstname   : { type: String },
    lastname    : { type: String },
    email       : { type: String, required: true, index: {unique: true}, validate: emailValidator},
});

UserSchema.plugin(uniqueValidator);

// Export the model
export default mongoose.model('User', UserSchema);