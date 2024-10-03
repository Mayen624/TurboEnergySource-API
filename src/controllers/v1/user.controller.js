import userShemma from '#models/v1/users.js';
import validator from '#utils/v1/validator.js';
import bicrypt from '#utils/v1/bicrypt.js';
import validateData from "#utils/v1/ValidateData.js";

const getUsers = async (req,res) => {

    try {

        const users = await userShemma.find();

        return res.status(200).json({users});

    } catch (e) {
        return res.status(500).json({error: "Error fetching users"});
    }
}

const getUsersBySSE = async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const token = req.query.token;

    try {
        const SSEValidation = await validateData.validateSSEData(token);

        if (!SSEValidation.isValid) {
            res.write(`data: ${JSON.stringify({ error: SSEValidation.errors })}\n\n`);
            res.status(401).end();
            return;
        }

        const users = await userShemma.find();
        res.write(`data: ${JSON.stringify(users)}\n\n`);

        const intervalId = setInterval(async () => {
            const updatedData = await userShemma.find(); 
            res.write(`data: ${JSON.stringify(updatedData)}\n\n`);
        }, 3500);

        req.on('close', () => {
            clearInterval(intervalId);
            res.end();
        });

    } catch (e) {
        res.write(`data: ${JSON.stringify({ error: "Error fetching users: " + e.message })}\n\n`);
        res.status(500).end();
    }
};


const createUser = async (req,res) => {
    try {
        
        const {name, email, password, idRole} = req.body;

        const valData = await validateData.validateUserData(req.body);
        
        if(!valData.isValid){
            return res.status(400).json({errors: valData.errors});
        }

        const passwordHashed = await bicrypt.generateHash(password);

        const newUser = new userShemma({
            name    : name,
            email   : email,
            password: passwordHashed,
            idRole  : idRole,
        });

        await newUser.save();
        return res.status(200).json({success: 'User successfully created'})

    } catch (e) {
        return res.status(500).json({error: 'Error creating user, try again later: ' + e.message});
    }
}

const updateUser = async (req,res) => {

    const {id} = req.params;
    const {name, email, idRole, enabled} = req.body;

    if(!validator.isValidObjectId(id)) { 
        return res.status(404).json({error: "user id is requiered"});
    }

    if(!validator.isValidEmail(email)){
        return res.status(404).json({error: 'Email not valid'});
    }

    if(!validator.isValidObjectId(idRole)){
        return res.status(404).json({error: 'Role not valid'});
    }

    const user = await userShemma.findByIdAndUpdate(id, {name: name, email: email, idRole: idRole, enabled: enabled});

    if(!user){
        return res.status(404).json({error: "The user could not be upadte beacuse it was no found"});
    }

    return res.status(200).json({success: "User updated successfully"})
}

const enabledOrDisabled = async (req,res) => {

    const {id} = req.params;
    const {enabled} = req.body;

    if(!validator.isValidObjectId(id)){
        return res.status(404).json({error: "Id not valid"});
    }

    if(!enabled){
        return res.status(404).json('value requiered');
    }

    const user = await userShemma.findByIdAndUpdate(id, {enabled: enabled});

    const message = enabled === false ? 'The user has been disabled' : 'The user has been enabled';
    return res.status(200).json({success: message });
}


const userController = {
    getUsers,
    createUser,
    updateUser,
    getUsersBySSE,
    enabledOrDisabled
}

export default userController;