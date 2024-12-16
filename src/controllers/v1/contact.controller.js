import contactShemma from "#models/v1/contact.js";
import validateData from "#utils/v1/ValidateData.js";

const getContacts = async (req,res) => {
    try {
        const contacts = await contactShemma.find();
        return res.status(200).json({contacts});
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
        return res.status(500).json({error: 'Error creating user, try again later: ' + e.message});
    }
}

const updateContact = async (req,res) => {
    
}

const enabledOrDisabledContact = async (req,res) => {
    
}



const contactController = {getContacts, addContact, updateContact, enabledOrDisabledContact};

export default contactController;