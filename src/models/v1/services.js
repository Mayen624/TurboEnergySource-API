import mongoose from "mongoose";

const {model, Schema} = mongoose;

const serviceShemma = new Schema({
    title: { type: String, unique: true, required: true },
    description: { type: String, required: true }, // Se mapea a subTitle en Astro
     images: {
        type: [{
            src: {type: String, require: true},
            mime: {type: String, require: true},
            name: {type: String, require: true},
            orgName: {type: String, require: true},
            alt: {type: String, require: true} // Texto alternativo para accesibilidad
        }],
        validate: {
            validator: function (v) {
                return v.length >= 1 && v.length <= 2; // Mínimo 1, máximo 2 imágenes
            },
            message: 'Debe haber entre 1 y 2 imágenes.'
        }
    },
    isRightSection: {type: Boolean, default: false}, // true = RightSection (texto izq, img der), false = LeftSection (img izq, texto der)
    single: {type: Boolean, default: false}, // Para RightSection: true = 1 imagen, false = 2 imágenes (solo aplica si isRightSection=true)
    btnExists: {type: Boolean, default: false}, // Si tiene botón CTA en la sección principal
    btnTitle: {type: String, required: false}, // Título del botón
    btnURL: {type: String, required: false}, // URL del botón
    enabled: { type: Boolean, default: true },
    createdBy: { type: mongoose.Types.ObjectId, required: true, ref: 'User'},
    updatedBy: { type: mongoose.Types.ObjectId, default: null, ref: 'User'},
}, {timestamps  : true});

const service = model('Services', serviceShemma);

export default service;
