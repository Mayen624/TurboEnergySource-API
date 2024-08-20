import mongoose from "mongoose";
import validator from "#utils/v1/validator.js";
import actionShemma from "#models/v1/actions.js";
import roleShemma from "#models/v1/roles.js";
import userShemma from "#models/v1/users.js";

/**
 * Validate all action data bafore create an new action
 * @param {object} req.body - El valor a validar
 * @returns {boolean, object} isValid, errors
 */
const validateActionsData = async (data) => {

    const errors = [];  

    if(!validator.isNonEmptyString(data.name)){
        errors.push('name of action required');
    }

    if(data.name.length < 3 || data.name > 15){
        errors.push('name must be between 3 and 15 characteres');
    }

    if(!validator.isNonEmptyString(data.description)){
        errors.push('description of action required');
    }

    if(data.description.length < 5 || data.description.length > 100){
        errors.push('description must be between 5 and 100 characteres');
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors : errors
    };
    
}

/**
 * Validate all role data bafore create an new role
 * @param {object} req.body - El valor a validar
 * @returns {boolean, object} isValid, errors
 */
const validateRolesData = async (data) => {

    const errors = [];  

    if(!validator.isNonEmptyString(data.name)){
        errors.push('role name required');
    }

    if(data.name.length < 3 || data.name > 15){
        errors.push('name must be between 3 and 15 characteres');
    }

    if(!validator.isNonEmptyString(data.description)){
        errors.push('role description required');
    }

    if(data.description.length < 5 || data.description.length > 100){
        errors.push('role description must be between 5 and 100 characteres');
    }

    if(!Array.isArray(data.actions)){
        errors.push('Actions not valid, incorrect format');
    }

    if(data.actions.length <= 0){
        errors.push('Role must be have at leat 1 action');
    }

    if(!validator.isValidObjectId(data.actions)){
        errors.push('The role dosn´t exist or the id format is not valid');
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors : errors
    };
    
}

/**
 * Validate all user data bafore create an new user
 * @param {object} req.body - El valor a validar
 * @returns {boolean, object} isValid, errors
 */
const validateUserData = async (userData) =>{

    const errors = [];

    if(!validator.isNonEmptyString(userData.name) || userData.name.length < 5 || userData.name.length > 15){
        errors.push("Username not valid, this must have min 5 caracthers and max 15 caracthers"); 
    }

    if(!validator.isValidEmail(userData.email)){
        errors.push("Email not valid, incorrect format");
    }

    if(!validator.isStrongPassword(userData.password)){
        errors.push("Password not valid, this must have at leat 1 uppercase letter, 1 lowecase letter and 1 number");
    }

    if(!validator.isValidObjectId(userData.idRole)){
        errors.push("id role not valid");
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors : errors
    };
}


const valData = {validateActionsData, validateRolesData, validateUserData};

export default valData;