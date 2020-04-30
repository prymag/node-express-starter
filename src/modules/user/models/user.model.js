import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    username    : { type: String, required: true, max: 100, index: {unique: true}},
    password    : { type: String, required: true},
    firstname   : { type: String },
    lastname    : { type: String },
    email       : { type: String, required: true},
});

// Export the model
export default mongoose.model('User', UserSchema);