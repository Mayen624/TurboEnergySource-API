import mongoose from "mongoose";
import validator from "#utils/v1/validator.js";

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

const valActionsData = {validateActionsData};

export default valActionsData;