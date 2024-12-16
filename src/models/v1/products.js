import mongoose from "mongoose";

const { model, Schema } = mongoose;

const productShemma = new Schema({
    title: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    mainContent: {
        introduction: { type: String, required: true },
        img: {
            src: {type: String, require: true},
            mime: {type: String, require: true},
            name: {type: String, require: true},
            orgName: {type: String, require: true}
        }
    },
    haveSpecification: {type: Boolean, default: false},
    haveBluePrints: {type: Boolean, default: false},
    longDescription: {
        longDescriptionTitle: { type: String, required: true},
        longDescriptionSubTitle: { type: String, required: true },
        btnTitle: {type: String, required: true}
    },
    descriptionList: [
        {
            title: { type: String, required: false },
            subTitle: { type: String, required: false }
        }
    ],
    specificationsLeft: {
        type: [
            {
                title: { type: String, required: false },
                subTitle: { type: String, required: false }
            }
        ],
        validate: {
            validator: function (v) {
                return v.length <= 3; // Limita el número máximo de elementos a 3
            },
            message: 'Solo se permite un máximo de 3 elementos.'
        }
    },
    specificationTableData: [
        {
            feature: { type: [String], required: false },
            description: { type: [[String]], required: false }
        }
    ],
    blueprints: {
        first: { type: String, required: false },
        second: { type: String, required: false }
    },
    enabled: { type: Boolean, default: true },
    createdBy: { type: mongoose.Types.ObjectId, required: true, ref: 'User'},
    updatedBy: { type: mongoose.Types.ObjectId, default: null, ref: 'User'},
}, { timestamps: true });

const product = model('Products', productShemma);

export default product;