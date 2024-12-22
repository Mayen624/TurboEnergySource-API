import validator from "#utils/v1/validator.js"
import actionsShemma from "#models/v1/actions.js";
import valActionsData from "#utils/v1/ValidateData.js";


const getActions = async (req,res) => {
    try {
        const actions = await actionsShemma.find();
        return res.status(200).json({actions});
    } catch (e) {
        return res.status(500).json({error: e})
    }
}

const addAction = async (req,res) => {
    try {
        const {name, description} = req.body;

        const valData = await valActionsData.validateActionsData(req.body);

        if(!valData.isValid){
            return res.status(400).json({errors: valData.errors})
        }

        const newAction = new actionsShemma({
            name: name,
            description: description
        });

        await newAction.save();
        return res.status(200).json({success: 'La accion han sido creada con exito'});
    } catch (e) {
        return res.status(500).json({error: 'error añadiendo la nueva accion: ' + e.message});
    }
}

const updateAction = async (req,res) => {
    const {id} = req.params;
    const {name, description} = req.body;

    console.log(id, name, description)

    try {
        if(!validator.isValidObjectId(id)){
            throw new Error('id no valido');
        }

        const action = await actionsShemma.findByIdAndUpdate(id, {name: name, description: description});

        if(!action){
            return res.status(404).json({error: 'La accion no se pudo actualizar porque no se encontro'});
        }

        return res.status(200).json({success: 'Accion actualizada con exito'});
        

    } catch (e) {
        return res.status(500).json({error: 'Error intentando actualizar accion: ' + e});
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

    const action = await actionsShemma.findByIdAndUpdate(id, {enabled: enabled});

    if(!action){
        return res.status(404).json({error: "La accion no pudo ser actualizada porque no se encontro"});
    }

    const message = enabled === false ? 'La accion ha sido desactivada' : 'La accion ha sido activada';
    return res.status(200).json({success: message });
}

const actionsController = {getActions, addAction, updateAction, enabledOrDisabled};

export default actionsController;