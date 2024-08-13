import mongoose from "mongoose";
import validator from "#utils/v1/validator.js";

const validateActionsData = async (name, description) => {

    const errors = {};  

    if(!validator.isNonEmptyString(name)){
        errors.name = 'name of action required';
    }

    if(name.length < 5 || name > 15){
        errors.name = 'name must be between 5 and 15 characteres';
    }

    if(!validator.isNonEmptyString(description)){
        errors.description = 'description of action required';
    }

    if(description.length < 5 || description.length > 100){
        errors.name = 'ddescription must be between 5 and 100 characteres';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors : errors
    };
    
}

const valActionsData = {validateActionsData};

export default valActionsData;