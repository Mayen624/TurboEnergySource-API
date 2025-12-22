import mongoose from 'mongoose';
import {fileTypeFromBuffer} from "file-type";

/**
 * Validate if the string value is not empty
 * @param {any} value - Value to validate
 * @returns {boolean}
 */
function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim() !== '';
}

/**
 * Validate if the value is an valid ObjectId from MongoDB
 * @param {String} value - EValue to validate
 * @returns {boolean}
 */
function isValidObjectId(value) {
  if (Array.isArray(value)) {
    return value.every(val => mongoose.Types.ObjectId.isValid(val));
  } else {
    return mongoose.Types.ObjectId.isValid(value);
  }
}

/**
 * Validate the correct format of an email
 * @param {any} value - Value to validate
 * @returns {boolean}
 */
function isValidEmail(value) {
    if (!value || !isNonEmptyString(value)) {
      return false;
    }

    // Regex más robusta que valida:
    // - Caracteres permitidos antes del @
    // - Dominio válido
    // - TLD de al menos 2 caracteres
    // - No permite espacios, múltiples @, puntos consecutivos
    const emailRegex = /^[a-zA-Z0-9]([a-zA-Z0-9._-]{0,63})[a-zA-Z0-9]@[a-zA-Z0-9]([a-zA-Z0-9.-]{0,253})[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;

    // Validaciones adicionales
    if (value.length > 254) return false; // RFC 5321
    if (value.includes('..')) return false; // No puntos consecutivos
    if (value.split('@').length !== 2) return false; // Exactamente un @

    const [localPart, domain] = value.split('@');
    if (localPart.length > 64) return false; // RFC 5321
    if (domain.length > 253) return false; // RFC 5321

    return emailRegex.test(value);
}

/**
 * Validate if an password is strong enough
 * @param {any} value - Value to validate
 * @returns {boolean}
 */
function isStrongPassword(value) {
    if(!isNonEmptyString(value)){
        return false;
    }

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    return passwordRegex.test(value);
}

/**
 * Validate the file type using fs.
 * @param {fileExt} - File extension
 * @param {Buffer} fileBuffer - Buffer file
 * @returns {Promise<boolean>} - true, false
 */
async function isValidImage(fileExt, fileBuffer){

  const ext = ['jpeg', 'jpe', 'jpg', 'png'];
  const mimeTypes = ['image/jpeg', 'image/jpe', 'image/jpg', 'image/png'];
  const fileType = await fileTypeFromBuffer(fileBuffer);

  if(ext.includes(fileExt) === false){
    return false
  }

  if (!fileType) {
    return false;
  }

  if(mimeTypes.includes(fileType.mime) === false){
    return false
  }

  return true
}

function isNullOrUndefined(value){
  if(value === null || value === undefined){
    return true
  }
  return false
}

/**
 * Validate international phone numbers
 * Supports formats: +1 234567890, +52 1234567890, +44 1234567890, etc.
 * @param {any} value - Value to validate
 * @returns {boolean}
 */
function isValidPhone(value){
  if(!isNonEmptyString(value)){
    return false
  }

  // Permite formatos internacionales más flexibles:
  // +XX XXXXXXXXXX (con espacio)
  // +XX-XXXXXXXXXX (con guión)
  // +XXXXXXXXXXXX (sin separador)
  // +XX (XXX) XXXXXXX (con paréntesis)
  const phoneRegex = /^\+[1-9]\d{0,3}[\s.-]?(\(?\d{1,4}\)?[\s.-]?)?\d{4,14}$/;

  // Extraer solo dígitos para validar longitud
  const digitsOnly = value.replace(/\D/g, '');

  // Debe tener entre 7 y 15 dígitos (estándar ITU-T E.164)
  if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    return false;
  }

  return phoneRegex.test(value);
}

/**
 * Validate person names (first name, last name)
 * Allows letters, spaces, hyphens, and accented characters
 * @param {any} value - Value to validate
 * @returns {boolean}
 */
function isValidName(value) {
  if (!isNonEmptyString(value)) {
    return false;
  }

  // Permite letras (incluyendo acentuadas), espacios, guiones y apóstrofes
  // Ejemplos válidos: "José", "María-Elena", "O'Brien", "Jean Pierre"
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+([\s'-][a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+)*$/;

  // Longitud entre 2 y 50 caracteres
  if (value.length < 2 || value.length > 50) {
    return false;
  }

  // No permite múltiples espacios consecutivos
  if (/\s{2,}/.test(value)) {
    return false;
  }

  return nameRegex.test(value);
}

function validateObjectProperties(obj) {
  for (const key in obj) {
    if (obj[key].trim() === '') {
      return false;
    }
  }
  return true;
}

function getFileExtension(fileName) {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts.pop() : '';
}

const validators = {
    validateObjectProperties,
    isNullOrUndefined,
    isNonEmptyString,
    isStrongPassword,
    getFileExtension,
    isValidObjectId,
    isValidEmail,
    isValidImage,
    isValidPhone,
    isValidName
};

export default validators;