import userShemma from '#models/v1/users.js';
import validator from '#utils/v1/validator.js';
import bicrypt from '#utils/v1/bicrypt.js';
import validateUserData from "#utils/v1/ValidateData.js";
import mongoose from 'mongoose';

const getUsers = async (req,res) => {

    try {

        const users = await userShemma.find();

        return res.status(200).json({users});

    } catch (e) {
        return res.status(500).json({error: "Error fetching users"});
    }
}

const createUser = async (req,res) => {
    try {
        
        const {name, email, password, idRole} = req.body;

        const valData = await validateUserData.validateUserData(req.body);
        
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


const userController = {
    getUsers,
    createUser,
    updateUser
}

export default userController;