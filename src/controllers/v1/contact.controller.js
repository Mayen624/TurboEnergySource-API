import contactShemma from "#models/v1/contact.js";
import validateData from "#utils/v1/ValidateData.js";
import {paginate} from "#utils/v1/functions.js";

const getContacts = async (req,res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const paginateData = await paginate(contactShemma, page, limit);

        if(paginateData.error) {return res.status(500).json({error: paginateData.error})}
        
        return res.status(200).json(
            {   
                limit: limit,
                contacts: paginateData.data, 
                total : paginateData.total, 
                totalPages : paginateData.totalPages, 
                currentPage: paginateData.currentPage, 
            }
        );
    } catch (e) {
        return res.status(500).json({error: e})
    }
}

const addContact = async (req,res) => {

    try {
        
        const {firstName,lastName, email, phone, details} = req.body;

        const valData = await validateData.validateContactData(req.body);
        
        if(!valData.isValid){
            return res.status(400).json({errors: valData.errors});
        }

        

        const newContact = new contactShemma({
            firstName    : firstName,
            lastName    : lastName,
            email   : email,
            phone: phone,
            details  : details,
        });

        await newContact.save();
        return res.status(200).json({success: 'La solicitud fue enviada con exito , espere nuestra respuesta en su correo electronico.'});

    } catch (e) {
        return res.status(500).json({error: 'Error creando un usuario, intente de nuevo: ' + e.message});
    }
}

const updateContact = async (req,res) => {
    
}

const enabledOrDisabledContact = async (req,res) => {
    
}



const contactController = {getContacts, addContact, updateContact, enabledOrDisabledContact};

export default contactController;