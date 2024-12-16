import mongoose from "mongoose";
import validator from "#utils/v1/validator.js";
import actionShemma from "#models/v1/actions.js";
import roleShemma from "#models/v1/roles.js";
import userShemma from "#models/v1/users.js";
import jwt from "jsonwebtoken";

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

    if(!Array.isArray(data.actions) || data.actions.length === 0){
        errors.push('Role must be have at leat 1 action');
    }

    if(!validator.isValidObjectId(data.actions)){
        errors.push('The actions dosn´t exist or the id format is not valid');
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

/**
 * Validate data for Server-Sent Events requests
 * @param {token} - El valor a validar
 * @returns {boolean, object} isValid, errors
 */
const validateSSEData = async (token) => {
    const errors = [];
    
    if(!token){
        errors.push("Auth token required");
    }else{

        const decodedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        if (!decodedToken) {
            errors.push("Invalid token");
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors : errors[0]
    };

   
}

/**
 * Validate all user data bafore create an new user
 * @param {object} req.body.productData - El valor a validar
 * @returns {boolean, object} isValid, errors
 */

const validateProductData = async (productData) =>{

    const errors = [];

    if(!validator.validateObjectProperties(productData.longDescription)){
        errors.push("Titulo, descripcion o titulo de boton, de descripcion detallada requerido.");
    }

    if(!Array.isArray(productData.descriptionList) || productData.descriptionList <= 0){
        errors.push("La lista de descripcion detallada require por lo menos 1 elemento"); 
    }

    if(!Array.isArray(productData.descriptionList) || productData.descriptionList.length > 3){
        errors.push("La lista de descripcion detallada permite como maximo 3 elementos"); 
    }

    if(!Array.isArray(productData.specificationsLeft || productData.specificationsLeft.length > 3)){
        errors.push("La lista de especificaciones no es valida o supera el maximo de elemento el cual es 5");
    }

    if(!Array.isArray(productData.specificationTableData)){
        errors.push("Datos de la tabla de especoficaciones no valida.");
    }

    if(!Array.isArray(productData.specificationTableData.feature) || productData.specificationTableData.feature.length > 2){
        errors.push("Solo se permiten 2 encabezados para la tabla de especificaciones (ESPECIFICACION y VALOR)");
    }

    if(!Array.isArray(productData.specificationTableData.description) || productData.specificationTableData.description.length > 10){
        errors.push("Solo se permiten como maximo 5 elementos en la tabla de especificaciones");
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors : errors
    };
}

const validateContactData = async (contactData) =>{

    const errors = [];

    if(!validator.isNonEmptyString(contactData.firstName) || contactData.firstName.length < 5 || contactData.firstName.length > 15){
        errors.push("FirstName not valid, this must have min 5 caracthers and max 15 caracthers"); 
    }

    if(!validator.isNonEmptyString(contactData.lastName) || contactData.lastName.length < 5 || contactData.lastName.length > 15){
        errors.push("LastName not valid, this must have min 5 caracthers and max 15 caracthers"); 
    }

    if(!validator.isValidEmail(contactData.email)){
        errors.push("Email not valid, incorrect format");
    }

    if (typeof contactData.details !== "string" || contactData.details.trim().length < 10 || contactData.details.trim().length > 300) {
        errors.push("The details provided must be text between 10 and 300 characters");
    }

    if (!validator.isValidPhone(contactData.phone) ) {
        errors.push("The phone number must be a string between 5 and 15 digits");
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors : errors
    };
}

const valData = {validateActionsData, validateRolesData, validateUserData, validateSSEData, validateProductData , validateContactData};

export default valData;