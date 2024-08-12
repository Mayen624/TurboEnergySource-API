import mongoose from "mongoose";

const {model, Schema} = mongoose;

const serviceShemma = new Schema({
    title       : {type: string, unique: true, required: true},
    description : {type: string, required: true},
    createdBy   : {type: Date, required: true},
    updatedBy   : {type: Date, required: true},
    image       : {type: String}
}, {timestamp: true});

const service = model('Services', serviceShemma);

export default service;