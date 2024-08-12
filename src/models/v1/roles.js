import mongoose from "mongoose";

const {model, Schema} = mongoose;

const rolShemma = new Schema({
    name        : {type : String, unique: true, required: true},
    description : {type : String, required: true},
    actions     : [{type: mongoose.ObjectId, ref: 'Actions'}],
    enabled     : {type : Boolean}
}, {timestamps: true});

const rols = model('Roles', rolShemma);

export default rols;