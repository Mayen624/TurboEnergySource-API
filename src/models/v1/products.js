import mongoose from "mongoose";

const {model, Schema} = mongoose;

const productShemma = new Schema({
    title       : {type: String, unique: true, required: true},
    description : {type: String, required: true},
    createdBy   : {type: Date, required: true},
    updatedBy   : {type: Date, required: true},
    images      : {type: String},
    enabled     : {type: Boolean, default: true}
}, {timestamps: true});

const product = model('Products', productShemma);

export default product;