import mongoose from "mongoose";

const {model, Schema} = mongoose;

const rolShemma = new Schema({
    name        : {type : String, unique: true, required: true},
    description : {type : String, required: true},
    actions     : [{type: mongoose.Types.ObjectId, ref: 'Actions'}],
    enabled     : {type : Boolean, default: true}
}, {timestamps: true});

const rols = model('Roles', rolShemma);

export default rols;