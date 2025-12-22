import servicesShemma from "#models/v1/services.js";
import validator from "#utils/v1/validator.js"
import valData from "#utils/v1/ValidateData.js";
import {getUUID} from "#utils/v1/functions.js";
import {paginate} from "#utils/v1/functions.js";
import {uploadFileToBucket} from "#services/v1/googleBucket.js";
import jwt from "jsonwebtoken";

const getServices = async (req,res) => {

    try {
        const { page = 1, limit = 10 } = req.query;

        // Opciones de populate
        const populateOptions = [
            { path: 'createdBy', select: 'name' },
            { path: 'updatedBy', select: 'name' }
        ];

        const paginateData = await paginate(servicesShemma, page, limit, {}, populateOptions);

        if (paginateData.error) {
            return res.status(500).json({ error: paginateData.error });
        }

        return res.status(200).json({
            limit,
            services: paginateData.data,
            total: paginateData.total,
            totalPages: paginateData.totalPages,
            currentPage: paginateData.currentPage
        });
    } catch (e) {
        console.log(e)
        return res.status(500).json({ error: e.message });
    }
}

const getServiceById = async (req,res) => {
    try {
        const {id} = req.params;

        if(!validator.isValidObjectId(id)) {
            return res.status(404).json({error: "identificador de servicio incorrecto o no existente."});
        }

        const serviceData = await servicesShemma.findById(id)
            .populate('createdBy', 'name')
            .populate('updatedBy', 'name');

        if(!serviceData){
            return res.status(404).json({error: "Servicio no encontrado."});
        }

        return res.status(200).json({service: serviceData});
    } catch (e) {
        return res.status(500).json({error: "Error obteniendo servicio: " + e.message});
    }
}

const addService = async (req,res) => {
    try {

        const serviceData = JSON.parse(req.body.product);
        const files = req.files; // Ahora recibe múltiples archivos

        if(validator.isNullOrUndefined(serviceData) || !files || files.length === 0){
            return res.status(400).json({error: 'Por favor ingrese la información requerida y al menos una imagen.'});
        }

        if(files.length > 2){
            return res.status(400).json({error: 'Máximo 2 imágenes permitidas.'});
        }

        // Validar todas las imágenes
        const uploadedImages = [];
        for (const file of files) {
            const fileExt = validator.getFileExtension(file.originalname);
            const uuid = getUUID();
            const fileName = `${uuid}.${fileExt}`;
            const bufferFile = file.buffer;
            const isValidImage = await validator.isValidImage(fileExt, bufferFile);

            if(!isValidImage){
                return res.status(400).json({error: `Imagen "${file.originalname}" no es válida.`});
            }

            const isUpload = await uploadFileToBucket(bufferFile, fileName, 'services');

            if(!isUpload){
                return res.status(500).json({error: 'Ha ocurrido un error, por favor intente de nuevo.'});
            }

            const destinyPath = `https://storage.googleapis.com/turbo-energy-storage/uploads/services/${fileName}`;

            uploadedImages.push({
                src: destinyPath,
                mime: file.mimetype,
                name: fileName,
                orgName: file.originalname,
                alt: serviceData.images?.[uploadedImages.length]?.alt || serviceData.title
            });
        }

       const valDataService = await valData.validateServicesData(serviceData);

        if(!valDataService.isValid){
            return res.status(400).json({errors: valDataService.errors})
        }

        const newService = new servicesShemma({
            title: serviceData.title,
            description: serviceData.description,
            images: uploadedImages,
            isRightSection: serviceData.isRightSection || false,
            single: serviceData.single || false,
            btnExists: serviceData.btnExists || false,
            btnTitle: serviceData.btnTitle || null,
            btnURL: serviceData.btnURL || null,
            createdBy: req.user.userId
        });

        await newService.save();

        return res.status(200).json({success: 'Servicio creado exitosamente.'})

    } catch (e) {
        console.log(e)
        return res.status(500).json({ error: e.message });
    }
}

const updateService = async (req,res) => {
    try {
        const {id} = req.params;

        if(!validator.isValidObjectId(id)){
            return res.status(404).json({error: 'Id no válido'});
        }

        const serviceData = JSON.parse(req.body.product);
        const files = req.files; // Puede ser undefined si no hay nuevas imágenes

        if(validator.isNullOrUndefined(serviceData)){
            return res.status(400).json({error: 'Por favor ingrese la información requerida.'});
        }

        // Validate service data
        const valDataService = await valData.validateServicesData(serviceData);

        if(!valDataService.isValid){
            return res.status(400).json({errors: valDataService.errors})
        }

        // Get existing service to preserve images if no new ones provided
        const existingService = await servicesShemma.findById(id);

        if(!existingService){
            return res.status(404).json({error: 'Servicio no encontrado.'});
        }

        // Start with existing images
        let images = existingService.images || [];

        // If new images provided, upload them
        if(files && files.length > 0){
            if(files.length > 2){
                return res.status(400).json({error: 'Máximo 2 imágenes permitidas.'});
            }

            const uploadedImages = [];
            for (const file of files) {
                const fileExt = validator.getFileExtension(file.originalname);
                const uuid = getUUID();
                const fileName = `${uuid}.${fileExt}`;
                const bufferFile = file.buffer;
                const isValidImage = await validator.isValidImage(fileExt, bufferFile);

                if(!isValidImage){
                    return res.status(400).json({error: `Imagen "${file.originalname}" no es válida.`});
                }

                const isUpload = await uploadFileToBucket(bufferFile, fileName, 'services');

                if(!isUpload){
                    return res.status(500).json({error: 'Ha ocurrido un error, por favor intente de nuevo.'});
                }

                const destinyPath = `https://storage.googleapis.com/turbo-energy-storage/uploads/services/${fileName}`;

                uploadedImages.push({
                    src: destinyPath,
                    mime: file.mimetype,
                    name: fileName,
                    orgName: file.originalname,
                    alt: serviceData.images?.[uploadedImages.length]?.alt || serviceData.title
                });
            }

            images = uploadedImages;
        } else {
            // If no new images, update alt texts if provided
            if (serviceData.images && Array.isArray(serviceData.images)) {
                images = images.map((img, index) => ({
                    ...img,
                    alt: serviceData.images[index]?.alt || img.alt
                }));
            }
        }

        const updateData = {
            title: serviceData.title,
            description: serviceData.description,
            images: images,
            isRightSection: serviceData.isRightSection !== undefined ? serviceData.isRightSection : existingService.isRightSection,
            single: serviceData.single !== undefined ? serviceData.single : existingService.single,
            btnExists: serviceData.btnExists !== undefined ? serviceData.btnExists : existingService.btnExists,
            btnTitle: serviceData.btnTitle || existingService.btnTitle,
            btnURL: serviceData.btnURL || existingService.btnURL,
            updatedBy: req.user.userId
        };

        const service = await servicesShemma.findByIdAndUpdate(id, updateData, { new: true });

        if(!service){
            return res.status(404).json({error: 'El servicio no pudo ser actualizado.'});
        }

        return res.status(200).json({success: 'Servicio actualizado exitosamente.'});

    } catch (e) {
        console.log(e)
        return res.status(500).json({error: 'Error actualizando servicio: ' + e.message});
    }
}

const disabledService = async (req,res) => {
    try {
        const {id} = req.params;
        const {enabled} = req.body;

        if(!validator.isValidObjectId(id)){
            return res.status(404).json({error: "Id no valido"});
        }

        if(enabled === undefined || enabled === null){
            return res.status(404).json({error: 'valor requerido'});
        }

        const service = await servicesShemma.findByIdAndUpdate(id, {enabled: enabled});

        if(!service){
            return res.status(404).json({error: "El servicio no pudo ser actualizado porque no se encontro"});
        }

        const message = enabled === false ? 'El servicio ha sido desactivado' : 'El servicio ha sido activado';
        return res.status(200).json({success: message });
    } catch (e) {
        return res.status(500).json({error: 'Error cambiando estado del servicio: ' + e.message});
    }
}

const servicesController = {getServices, getServiceById, addService, updateService, disabledService};

export default servicesController;
