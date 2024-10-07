import roleShemma from "#models/v1/roles.js";
import validator from "#utils/v1/validator.js";
import valRolesData from "#utils/v1/ValidateData.js";


const getRoles = async (req,res) => {
    try {

        const roles = await roleShemma.find();
        return res.status(200).json({roles});
    } catch (e) {
        return res.status(200).json({error: 'Error tying to get roles' + e});
    }
}

const addRole = async (req,res) => {
    try {

        const {name, description, actions} = req.body;

        const valData = await valRolesData.validateRolesData(req.body);

        if(!valData.isValid){
            return res.status(404).json({errors: valData.errors});
        }

        const newRole = new roleShemma({
            name: name,
            description: description,
            actions: actions
        });

        await newRole.save();
        return res.status(200).json({success: 'Role successfully created'});

    } catch (e) {
        return res.status(500).json({error: 'Error trying to add a new role: ' + e.message});
    }
}

const updateRole = async (req,res) => {
    try {
        const {id} = req.params;
        const {name, description, actions} = req.body;

        if(!validator.isValidObjectId(id)){
            return res.status(404).json({error: 'id not valid'});
        }

        const role = await roleShemma.findByIdAndUpdate(id, {name: name, description: description, actions: actions});

        if(!role){
            return res.status(404).json({error: 'The role could not updated beacause de role was not found'});
        }

        return res.status(200).json({success: 'Role successfully updated', role});

    } catch (e) {
        return res.status(500).json({error: 'Error trying to update role: ' + e.message});
    }
}

const enabledOrDisabled = async (req,res) => {

    const {id} = req.params;
    const {enabled} = req.body;

    if(!validator.isValidObjectId(id)){
        return res.status(404).json({error: "Id not valid"});
    }

    if(enabled === undefined || enabled === null){
        return res.status(404).json('value requiered');
    }

    const role = await roleShemma.findByIdAndUpdate(id, {enabled: enabled});

    if(!role){
        return res.status(404).json({error: "The role could not be upadte beacuse was not found"});
    }

    const message = enabled === false ? 'The role has been disabled' : 'The role has been enabled';
    return res.status(200).json({success: message });
}

const roleController = {getRoles, addRole, updateRole, enabledOrDisabled};

export default roleController;
