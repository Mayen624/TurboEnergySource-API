import actionsShemma from "#models/v1/actions.js";
import valActionsData from "#utils/v1/validateData/valActionData.js"


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

        const valData = await valActionsData(name, description);

        if(!valData.isValid){
            return res.status(400).json({error: valData.error})
        }

        const newAction = new actionsShemma({
            name: name,
            description: description
        });

        await newAction.save();
        return res.status(200).json({success: 'Action successfully added'});
    } catch (e) {
        return res.status(500).json({error: 'error adding new action: ' + e});
    }
}

const updateAction = async (req,res) => {
    const {id} = req.query;
}

const disabledAction = async (req,res) => {
    const {id} = req.query;
}

const actionsController = {getActions, addAction, updateAction, disabledAction};

export default actionsController;