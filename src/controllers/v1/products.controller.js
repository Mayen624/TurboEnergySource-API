import productsShemma from "#models/v1/products.js";
import validator from "#utils/v1/validator.js"
import valData from "#utils/v1/ValidateData.js";
import functions from "#utils/v1/functions.js";
import {uploadFileToBucket} from "#services/v1/googleBucket.js";
import jwt from "jsonwebtoken";


const getProducts = async (req, res) => {
    try {
        const products = await productsShemma.find()
            .populate('createdBy', 'name')
            .populate('updatedBy', 'name');

        // Reordenar las propiedades de cada producto
        const reorderedProducts = products.map(product => ({
            _id: product._id,
            title: product.title,
            description: product.description,
            mainContent: product.mainContent,
            longDescription: product.longDescription,
            haveSpecification: product.haveSpecification,
            haveBluePrints: product.haveBluePrints,
            descriptionList: product.descriptionList,
            specificationsLeft: product.specificationsLeft,
            specificationTableData: product.specificationTableData,
            enabled: product.enabled,
            createdBy: product.createdBy,
            updatedBy: product.updatedBy,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            __v: product.__v
        }));

        return res.status(200).json({ products: reorderedProducts });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
};


const addProduct = async (req,res) => {
    try {
       
        const productData = JSON.parse(req.body.product);
        const authHeader = req.headers['authorization'];
        const token = authHeader.split(' ')[1];
        const file = req.file;

        if(validator.isNullOrUndefined(productData) || validator.isNullOrUndefined(file)){
            return res.status(400).json({error: 'Porfavor ingrese la infromacion requerida.'});
        }

        const fileExt = validator.getFileExtension(file.originalname);
        const fileName = `${functions.getUUID()}.${fileExt}`;
        const bufferFile = file.buffer;
        const isValidImage = await validator.isValidImage(fileExt, bufferFile);
        
        if(!isValidImage){
            return res.status(400).json({error: 'Imagen seleccionada no valida.'});
        }

       const valDataProduct = await valData.validateProductData(productData);

        if(!valDataProduct.isValid){
            return res.status(400).json({errors: valDataProduct.errors})
        }

        const decodedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

        const isUpload = await uploadFileToBucket(bufferFile, fileName, 'products');

        if(!isUpload){
            return res.status(500).json({error: 'Ha acurrido un error, profavor intente de nuevo.'});
        }

        const destinyPath = `https://storage.googleapis.com/turbo-energy-storage/uploads/products/${fileName}`;

        const mainContent = {
            introduction: productData.mainContent.introduction,
            img: {src: destinyPath, mime: file.mimetype, name: fileName, orgName: file.originalname}
        }

        const newProduct = new productsShemma({
            title: productData.title,
            description: productData.description,
            mainContent: mainContent,
            longDescription: productData.longDescription,
            descriptionList: productData.descriptionList,
            specificationsLeft: productData.specificationsLeft,
            specificationTableData: productData.specificationTableData,
            haveSpecification: productData.haveSpecification,
            haveBluePrints: productData.haveluePrints,
            createdBy: decodedToken.userInfo._id
        });

        // Antes de guardar lograr crear buket del servicio de google, para poder almacenar las img
        await newProduct.save();

        return res.status(200).json({success: 'Producto creado existosamente.'})

    } catch (e) {
        console.log(e)
        return res.status(500).json({ error: e.message });
    }
}

const updateProduct = async (req,res) => {
    
}

const disabledAndEnabledProduct = async (req,res) => {
    const {id} = req.params;
    const {enabled} = req.body;

    if(!validator.isValidObjectId(id)){
        return res.status(404).json({error: "Id not valid"});
    }

    if(enabled === undefined || enabled === null){
        return res.status(404).json('Valor requerido');
    }

    const product = await productsShemma.findByIdAndUpdate(id, {enabled: enabled});

    if(!product){
        return res.status(404).json({error: "The product could not be upadte beacuse was not found"});
    }

    const message = enabled === false ? 'The product has been disabled' : 'The product has been enabled';
    return res.status(200).json({success: message });
}

const productsController = {getProducts, addProduct, updateProduct, disabledAndEnabledProduct};

export default productsController;