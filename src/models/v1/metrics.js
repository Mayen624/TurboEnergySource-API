import mongoose from 'mongoose';

const {model, Schema} = mongoose;

const metricShemma = new Schema({
    views       : {type: Number, default: 0},
    itemId      : { type: mongoose.Schema.Types.ObjectId, required: true },
    itemType    : { type: String, required: true, enum: ['products', 'services'] },
}, { timestamps: true });

const metric = model('Metrics', metricShemma);

export default metric;