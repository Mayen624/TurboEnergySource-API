import mongoose from 'mongoose';

const {model, Schema} = mongoose;

const contactShemma = new Schema({
    firstName   : {type: String, require: true},
    lastName    : {type: String, require: true},
    email       : {type: String, required: true},
    phone       : {type: String, required: true},
    details     : {type: String, required: true},
    status      : {
        type: String,
        enum: ['nuevo', 'contactado', 'en_proceso', 'cerrado_exitoso', 'cerrado_sin_interes'],
        default: 'nuevo'
    },
    notes       : [{
        content: {type: String, required: true},
        createdAt: {type: Date, default: Date.now},
        createdBy: {type: String, default: 'Admin'}
    }],
    lastContactDate: {type: Date, default: null},
    assignedTo  : {type: Schema.Types.ObjectId, ref: 'User', default: null}
}, {timestamps: true});

const contact = model('Contact', contactShemma);

export default contact;