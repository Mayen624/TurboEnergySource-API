import mongoose from "mongoose";

const {model, Schema} = mongoose;

const imageSchema = new Schema({
    src: { type: String, required: true },
    mime: { type: String, required: true },
    name: { type: String, required: true },
    orgName: { type: String, required: true },
});

const serviceShemma = new Schema({
    title       : {type: String, unique: true, required: true},
    description : {type: String, required: true},
    images: {
        type: [imageSchema],
        validate: {
          validator: function (value) {
            return value.length >= 1 && value.length <= 2; // Validar que haya entre 1 y 2 imágenes
          },
          message: 'El array de imágenes debe contener entre 1 y 2 elementos.',
        },
    },
    single      : {type: Boolean, require:  true},
    enabled     : {type: Boolean, default: true},
    createdBy   : { type: mongoose.Types.ObjectId, required: true, ref: 'User'},
    updatedBy   : { type: mongoose.Types.ObjectId, default: null, ref: 'User'},
}, {timestamps  : true});

const service = model('Services', serviceShemma);

export default service;