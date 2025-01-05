import roleShemma from "#models/v1/roles.js";
import validator from "#utils/v1/validator.js";
import valRolesData from "#utils/v1/ValidateData.js";


const getRoles = async (req,res) => {
    try {
        const roles = await roleShemma.find();
        return res.status(200).json({roles});
    } catch (e) {
        return res.status(200).json({error: 'Error intentando obtener los roles' + e});
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
        return res.status(200).json({success: 'Role creado exitosamente'});

    } catch (e) {
        return res.status(500).json({error: 'Error intentando crear un rol: ' + e.message});
    }
}

const updateRole = async (req,res) => {
    try {
        const {id} = req.params;
        const {name, description, actions} = req.body;

        if(!validator.isValidObjectId(id)){
            return res.status(404).json({error: 'id no valido'});
        }

        const role = await roleShemma.findByIdAndUpdate(id, {name: name, description: description, actions: actions});

        if(!role){
            return res.status(404).json({error: 'El  rol could no pudo ser actualizado porque no se encontro'});
        }

        return res.status(200).json({success: 'Role actualizado exitosamente ', role});

    } catch (e) {
        return res.status(500).json({error: 'Error intentando actualizar el rol: ' + e.message});
    }
}

const enabledOrDisabled = async (req,res) => {

    const {id} = req.params;
    const {enabled} = req.body;

    if(!validator.isValidObjectId(id)){
        return res.status(404).json({error: "Id no valido"});
    }

    if(enabled === undefined || enabled === null){
        return res.status(404).json('valor requerido');
    }

    const role = await roleShemma.findByIdAndUpdate(id, {enabled: enabled});

    if(!role){
        return res.status(404).json({error: "El rol no pudo ser actualizado porque no se encontro"});
    }

    const message = enabled === false ? 'El rol ha sido desactivado' : 'El rol ha sido activado';
    return res.status(200).json({success: message });
}

const roleController = {getRoles, addRole, updateRole, enabledOrDisabled};

export default roleController;
