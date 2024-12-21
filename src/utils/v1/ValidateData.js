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
        errors.push('nombre de la acción requerida');
    }

    if(data.name.length < 3 || data.name > 15){
        errors.push('el nombre debe tener entre 3 y 15 caracteres');
    }

    if(!validator.isNonEmptyString(data.description)){
        errors.push('descripción de la acción requerida');
    }

    if(data.description.length < 5 || data.description.length > 100){
        errors.push('La descripción debe tener entre 5 y 100 caracteres.');
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
        errors.push('nombre del rol requerido');
    }

    if(data.name.length < 3 || data.name > 15){
        errors.push('el nombre del rol debe tener entre 3 y 15 caracteres');
    }

    if(!validator.isNonEmptyString(data.description)){
        errors.push('requerida descripción del rol');
    }

    if(data.description.length < 5 || data.description.length > 100){
        errors.push('descripción del rol debe tener entre 5 y 100 caracteres.');
    }

    if(!Array.isArray(data.actions)){
        errors.push('Accion no valida , incorrecto formato');
    }

    if(!Array.isArray(data.actions) || data.actions.length === 0){
        errors.push('El rol debe tener al menos una acción');
    }

    if(!validator.isValidObjectId(data.actions)){
        errors.push('La accion no existe , y el id del formato es incorrecto');
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
        errors.push("Nombre de usuario no valido , este debe tener minimo 5 caracteres y maximo 15 caracteres"); 
    }

    if(!validator.isValidEmail(userData.email)){
        errors.push("Email no valido, formato incorrecto");
    }

    if(!validator.isStrongPassword(userData.password)){
        errors.push("Contraseña no valida, debe tener al menos 8 caracteres, una letra mayuscula, una letra minuscula, un numero y un caracter especial");
    }

    if(!validator.isValidObjectId(userData.idRole)){
        errors.push("id rol no valido");
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
        errors.push("Auth token requirido");
    }else{

        const decodedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        if (!decodedToken) {
            errors.push("Token no valido");
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
        errors.push("PrimerNombre no valido , este debe tener minimo 5 caracteres y maximo 15 caracteres"); 
    }

    if(!validator.isNonEmptyString(contactData.lastName) || contactData.lastName.length < 5 || contactData.lastName.length > 15){
        errors.push("Apellido no valido , este debe tener minimo 5 caracteres y maximo 15 caracteres"); 
    }

    if(!validator.isValidEmail(contactData.email)){
        errors.push("Email no valido , formato incorrecto");
    }

    if (typeof contactData.details !== "string" || contactData.details.trim().length < 10 || contactData.details.trim().length > 300) {
        errors.push("Los detalles  deben ser una cadena de texto entre 10 y 300 caracteres");
    }

    if (!validator.isValidPhone(contactData.phone) ) {
        errors.push("El número de teléfono debe ser una cadena de entre 5 y 15 dígitos.");
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors : errors
    };
}

const valData = {validateActionsData, validateRolesData, validateUserData, validateSSEData, validateProductData , validateContactData};

export default valData;