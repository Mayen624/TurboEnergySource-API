import contactShemma from "#models/v1/contact.js";


const getContacts = async (req,res) => {
    try {
        const contacts = await contactShemma.find();
        return res.status(200).json({contacts});
    } catch (e) {
        return res.status(500).json({error: e})
    }
}

const addContact = async (req,res) => {

    console.log(req.body);
    return res.status(200).json({success: 'Success response'})
}

const updateContact = async (req,res) => {
    
}

const enabledOrDisabledContact = async (req,res) => {
    
}



const contactController = {getContacts, addContact, updateContact, enabledOrDisabledContact};

export default contactController;