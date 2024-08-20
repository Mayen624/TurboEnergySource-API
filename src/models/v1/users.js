import mongoose from 'mongoose';

const {model, Schema} = mongoose;

const userShemma = new Schema({
    name      : {type: String, require: true},
    email     : {type: String, required: true, unique: true},
    password  : {type: String, required: true},
    image     : {type: String, default: null},
    idRole    : {type: mongoose.Types.ObjectId, required: true, ref: 'Roles'},
    enabled   : {type: Boolean, default: true},
}, {timestamps: true});

const user = model('User', userShemma);

export default user;