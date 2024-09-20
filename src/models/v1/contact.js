import mongoose from 'mongoose';

const {model, Schema} = mongoose;

const contactShemma = new Schema({
    firstName   : {type: String, require: true},
    lastName    : {type: String, require: true},
    email       : {type: String, required: true},
    phone       : {type: String, required: true},
    details     : {type: String, required: true},
}, {timestamps: true});

const contact = model('Contact', contactShemma);

export default contact;