import servicesShemma from "#models/v1/services.js";
import validator from "#utils/v1/validator.js"
import valData from "#utils/v1/ValidateData.js";
import {paginate} from "#utils/v1/functions.js";

const getServices = async (req,res) => {

    try {
        const { page = 1, limit = 10 } = req.query;

        const paginateData = await paginate(servicesShemma, page, limit);

        if (paginateData.error) {
            return res.status(500).json({ error: paginateData.error });
        }

        return res.status(200).json({
            limit,
            servcices: paginateData.data,
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

        const serviceData = await servicesShemma.findById(id);

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

        const valDataResult = await valData.validateServicesData(serviceData);

        if (!valDataResult.isValid) {
            return res.status(400).json({ errors: valDataResult.errors });
        }

        const newService = new servicesShemma(serviceData);
        await newService.save();

        return res.status(200).json({ success: 'Servicio creado exitosamente' });
    } catch (e) {
        return res.status(500).json({ error: 'Error creando servicio: ' + e.message });
    }
}

const updateService = async (req,res) => {
    try {
        const {id} = req.params;

        if(!validator.isValidObjectId(id)){
            return res.status(404).json({error: 'id no valido'});
        }

        const serviceData = JSON.parse(req.body.product);

        const service = await servicesShemma.findByIdAndUpdate(id, serviceData, { new: true });

        if(!service){
            return res.status(404).json({error: 'El servicio no pudo ser actualizado porque no se encontro'});
        }

        return res.status(200).json({success: 'Servicio actualizado exitosamente'});

    } catch (e) {
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