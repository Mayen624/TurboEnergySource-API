import mongoose from "mongoose";

const { model, Schema } = mongoose;

const productShemma = new Schema({
    title: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    mainContent: {
        id: { type: String, required: true, unique: true },
        introduction: { type: String, required: true },
        img: { type: String, required: true },
        imgAlt: { type: String, required: true }
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
    slug: { type: String, required: false },
    enabled: { type: Boolean, default: false },
    createdBy: { type: mongoose.Types.ObjectId, required: true },
    updatedBy: { type: mongoose.Types.ObjectId },
}, { timestamps: true });

const product = model('Products', productShemma);

export default product;