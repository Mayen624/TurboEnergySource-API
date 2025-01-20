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

const addService = async (req,res) => {

}

const updateService = async (req,res) => {
    
}

const disabledService = async (req,res) => {
    
}

const servicesController = {getServices, addService, updateService, disabledService};

export default servicesController;