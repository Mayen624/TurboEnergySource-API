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
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

  const ext = ['jpeg', 'jpe', 'jpg'];
  const mimeTypes = ['image/jpeg', 'image/jpe', 'image/jpg',];
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
    isValidImage
};

export default validators;