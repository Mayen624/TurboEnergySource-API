import productsShemma from "#models/v1/products.js";
import validator from "#utils/v1/validator.js"
import valData from "#utils/v1/ValidateData.js";
import {getUUID} from "#utils/v1/functions.js";
import {paginate} from "#utils/v1/functions.js";
import {uploadFileToBucket} from "#services/v1/googleBucket.js";
import jwt from "jsonwebtoken";


const getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        // Opciones de populate
        const populateOptions = [
            { path: 'createdBy', select: 'name' },
            { path: 'updatedBy', select: 'name' }
        ];

        const paginateData = await paginate(productsShemma, page, limit, populateOptions);

        if (paginateData.error) {
            return res.status(500).json({ error: paginateData.error });
        }

        // Reordena las propiedades de cada producto
        const reorderedProducts = paginateData.data.map(product => ({
            _id: product._id, title: product.title,
            description: product.description, mainContent: product.mainContent,
            longDescription: product.longDescription, haveSpecification: product.haveSpecification,
            haveBluePrints: product.haveBluePrints, descriptionList: product.descriptionList,
            specificationsLeft: product.specificationsLeft, specificationTableData: product.specificationTableData,
            enabled: product.enabled, createdBy: product.createdBy,
            updatedBy: product.updatedBy, createdAt: product.createdAt,
            updatedAt: product.updatedAt, __v: product.__v
        }));

        return res.status(200).json({
            limit,
            products: reorderedProducts,
            total: paginateData.total,
            totalPages: paginateData.totalPages,
            currentPage: paginateData.currentPage
        });
        
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
        let uuid = getUUID();
        const fileName = `${uuid}.${fileExt}`;
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

        if(!isUpload.success){
            return res.status(500).json({error: 'Ha acurrido un error, profavor intente de nuevo:' + isUpload.error});
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

const getProductById = async (req, res) => {
    try {
        const {id} = req.params;

        if(!validator.isValidObjectId(id)) {
            return res.status(404).json({error: "identificador de producto incorrecto o no existente."});
        }

        const productData = await productsShemma.findById(id)
            .populate('createdBy', 'name')
            .populate('updatedBy', 'name');

        if(!productData){
            return res.status(404).json({error: "Producto no encontrado."});
        }

        return res.status(200).json({product: productData});
    } catch (e) {
        return res.status(500).json({error: "Error obteniendo producto: " + e.message});
    }
}

const updateProduct = async (req,res) => {
    try {
        const {id} = req.params;

        if(!validator.isValidObjectId(id)){
            return res.status(404).json({error: 'Id no válido'});
        }

        const productData = JSON.parse(req.body.product);
        const file = req.file; // Optional - may be undefined if no new image

        if(validator.isNullOrUndefined(productData)){
            return res.status(400).json({error: 'Por favor ingrese la información requerida.'});
        }

        // Validate product data
        const valDataProduct = await valData.validateProductData(productData);

        if(!valDataProduct.isValid){
            return res.status(400).json({errors: valDataProduct.errors})
        }

        // Get existing product to preserve image if no new one provided
        const existingProduct = await productsShemma.findById(id);

        if(!existingProduct){
            return res.status(404).json({error: 'Producto no encontrado.'});
        }

        // Start with existing image data
        let mainContent = {
            introduction: productData.mainContent.introduction,
            img: existingProduct.mainContent.img // Keep existing by default
        };

        // If new image provided, upload it
        if(file){
            const fileExt = validator.getFileExtension(file.originalname);
            let uuid = getUUID();
            const fileName = `${uuid}.${fileExt}`;
            const bufferFile = file.buffer;
            const isValidImage = await validator.isValidImage(fileExt, bufferFile);

            if(!isValidImage){
                return res.status(400).json({error: 'Imagen seleccionada no válida.'});
            }

            const isUpload = await uploadFileToBucket(bufferFile, fileName, 'products');

            if(!isUpload){
                return res.status(500).json({error: 'Ha ocurrido un error, por favor intente de nuevo.'});
            }

            const destinyPath = `https://storage.googleapis.com/turbo-energy-storage/uploads/products/${fileName}`;

            // Update with new image data
            mainContent.img = {
                src: destinyPath,
                mime: file.mimetype,
                name: fileName,
                orgName: file.originalname
            };
        }

        const updateData = {
            title: productData.title,
            description: productData.description,
            mainContent: mainContent,
            longDescription: productData.longDescription,
            descriptionList: productData.descriptionList,
            specificationsLeft: productData.specificationsLeft,
            specificationTableData: productData.specificationTableData,
            haveSpecification: productData.haveSpecification,
            haveBluePrints: productData.haveluePrints,
            updatedBy: req.user.userId
        };

        const product = await productsShemma.findByIdAndUpdate(id, updateData, { new: true });

        if(!product){
            return res.status(404).json({error: 'El producto no pudo ser actualizado.'});
        }

        return res.status(200).json({success: 'Producto actualizado exitosamente.'});

    } catch (e) {
        console.log(e)
        return res.status(500).json({error: 'Error actualizando producto: ' + e.message});
    }
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
        return res.status(404).json({error: "El producto no se llego a actualizar o a encontrar"});
    }

    const message = enabled === false ? 'El producto se ha desactivado' : 'The product has been enabled';
    return res.status(200).json({success: message });
}

const productsController = {getProducts, getProductById, addProduct, updateProduct, disabledAndEnabledProduct};

export default productsController;