import mongoose from "mongodb";

const {model, Schema} = mongoose;

const actionsShemma = new Schema({
    name        : {type: String, required: true, unique: true},
    description : {type: String, required: true}
}, {timestamp: true});

const action = model('Actions', actionsShemma);

export default action;