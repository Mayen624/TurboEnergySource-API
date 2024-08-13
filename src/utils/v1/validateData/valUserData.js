import mongoose from 'mongoose';
import roleShemma from '#models/v1/roles.js';
import validators from '#utils/v1/validator.js';


/**
 * Validate all user data bafore create an new user
 * @param {object} req.body - El valor a validar
 * @returns {boolean, object} isValid, errors
 */
const validateUserData = async (userData) =>{

    const errors = {};

    if(!validators.isNonEmptyString(userData.name) || userData.name.length < 5 || userData.name.length > 15){
        errors.name = "Username not valid, this must have min 5 caracthers and max 15 caracthers";
    }

    if(!validators.isValidEmail(userData.email)){
        errors.email = "Email not valid, incorrect format";
    }

    if(!validators.isStrongPassword(userData.password)){
        errors.password = "Password not valid, this must have at leat 1 uppercase letter, 1 lowecase letter and 1 number";
    }

    const isValRole = await isValidRol(userData.idRole);

    if(!isValRole){
        errors.idRole = "Role not valid, the rol dosn´t exist or dosn´t have the correct format";
    }

    if(!userData.enabled){
        errors.enabled = "This value is required";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors : errors
    };
}

const isValidRol = async (value) => {

    if(!validators.isNonEmptyString(value)){
        return false;
    }

    const role = await roleShemma.findById(value);

    if(!validators.isValidObjectId(value) || !role){
        return false;
    }

    return true;
}

const vaUserData = {
    validateUserData
}
export default vaUserData;