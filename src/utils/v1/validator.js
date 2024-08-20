import mongoose from 'mongoose';

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
 * @param {any} value - EValue to validate
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

const validators = {
    isNonEmptyString,
    isStrongPassword,
    isValidObjectId,
    isValidEmail
};

export default validators;