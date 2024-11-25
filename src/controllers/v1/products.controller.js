import productsShemma from "#models/v1/products.js";
import validator from "#utils/v1/validator.js"


const getProdcuts = async (req,res) => {
    try {
        const products = await productsShemma.find();
        return res.status(200).json({products});
    } catch (e) {
        return res.status(500).json({error: e})
    }
}

const addProduct = async (req,res) => {
    try {
       
        const productData = JSON.parse(req.body.product);
        const file = req.file;

        if(validator.isNullOrUndefined(productData) || validator.isNullOrUndefined(file)){
            return res.status(400).json({error: 'Porfavor ingrese la infromacion requerida.'});
        }

        const fileExt = validator.getFileExtension(file.originalname);
        const bufferFile = file.buffer;
        const isValidImage = await validator.isValidImage(fileExt, bufferFile);
        
        if(!isValidImage){
            return res.status(400).json({error: 'Imagen seleccionada no valida.'});
        }

        //Validar productData si existe y tambei file, luego validar sus datos principales
        // Porduct -> mainContent.introduction, title, description, longDescription, descriptionList

        

    } catch (e) {
        console.log(e)
        return res.status(500).json({ error: e.message });
    }
}

const updateProduct = async (req,res) => {
    
}

const disabledProduct = async (req,res) => {
    
}

const productsController = {getProdcuts, addProduct, updateProduct, disabledProduct};

export default productsController;