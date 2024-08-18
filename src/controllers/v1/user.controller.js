import userShemma from '#models/v1/users.js';
import validator from '#utils/v1/validator.js';
import bicrypt from '#utils/v1/bicrypt.js';
import validateUserData from "#utils/v1/ValidateData.js";

const getUsers = async (req,res) => {

    try {

        const users = await userShemma.find();

        if(!users){
            return res.status(404).json({error: "Users not found"});
        }

        return res.status(200).json({users});

    } catch (e) {
        return res.status(500).json({error: "Error fetching users"});
    }
}

const createUser = async (req,res) => {
    try {
        
        const valData = await validateUserData.validateUserData(req.body);
        
        if(!valData.isValid){
            return res.status(400).json({errors: valData.errors});
        }

        const passwordHashed = await bicrypt.generateHash(req.body.password);

        //Logic for save user
        const newUser = new userShemma({
            name    : req.body.name,
            email   : req.body.email,
            password: passwordHashed,
            idRole  : req.body.idRole,
        });

        await newUser.save();
        return res.status(200).json({success: 'User successfully created'})

    } catch (e) {
        return res.status(500).json({error: 'Error creating user, try again later: ' + e});
    }
}

const updateUser = async (req,res) => {

    const {id} = req.query;

    if(validator.isValidObjectId(id)) {res.status(400).json({error: "user id is requiered"})};

    const userToUpdate = await userShemma.findById(id);

    if(!userToUpdate){
        return res.status(404).json({error: "User not found"});
    }

    //Logic for update user

    return res.status(200).json({success: "User updated successfully"})
}

const disableUser = (req,res) => {

}

const userController = {
    getUsers,
    createUser,
    updateUser,
    disableUser
}

export default userController;