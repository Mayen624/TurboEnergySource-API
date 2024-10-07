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
        return res.status(200).json({success: 'Action successfully added'});
    } catch (e) {
        return res.status(500).json({error: 'error adding new action: ' + e.message});
    }
}

const updateAction = async (req,res) => {
    const {id} = req.params;
    const {name, description} = req.body;

    console.log(id, name, description)

    try {
        if(!validator.isValidObjectId(id)){
            throw new Error('id not valid');
        }

        const action = await actionsShemma.findByIdAndUpdate(id, {name: name, description: description});

        if(!action){
            return res.status(404).json({error: 'The action could not update beacause the action was not found'});
        }

        return res.status(200).json({success: 'Action successfully updated'});
        

    } catch (e) {
        return res.status(500).json({error: 'Error trying to update action: ' + e});
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

    const action = await actionsShemma.findByIdAndUpdate(id, {enabled: enabled});

    if(!action){
        return res.status(404).json({error: "The action could not be upadte beacuse was not found"});
    }

    const message = enabled === false ? 'The action has been disabled' : 'The action has been enabled';
    return res.status(200).json({success: message });
}

const actionsController = {getActions, addAction, updateAction, enabledOrDisabled};

export default actionsController;