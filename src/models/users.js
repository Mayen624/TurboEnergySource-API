import mongoose from 'mongodb';

const {model, Schema} = mongoose;

const userShemma = new Schema({
    name      : {type: String, require: true},
    email     : {type: String, required: true, unique: true},
    password  : {type: String, required: true},
    image     : {type: String, default: null},
    enabled   : {type: Boolean},
    createdAt : {type: String},
    updatedAt : {type: String, default: null}
});

const user = model('User', userShemma);

export default user;