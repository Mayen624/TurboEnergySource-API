import mongoose from "mongoose";

const {model, Schema} = mongoose;

const actionsShemma = new Schema({
    name        : {type: String, required: true, unique: true},
    description : {type: String, required: true},
    enabled     : {type: Boolean, default: true}
}, {timestamps: true});

const action = model('Actions', actionsShemma);

export default action;