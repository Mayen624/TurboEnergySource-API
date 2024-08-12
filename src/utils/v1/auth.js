import userShemma from "#models/v1/users";
import bicrypt from "#utils/v1/bicrypt";
import jwt from "jsonwebtoken";

/**
 * Authtenticate the client
 * @params {string, string} email password - Values to validate
 * @returns {string}
 */
const authenticate = async (email, password) => {

    try {

        const user = await userShemma.findOne({email: email});
    
        if(!user){
            return res.status(400).json({error: 'The user was not found or dosn´t exist'});
        }
        
        const match = bicrypt.compareHash(password, user.password);

        if(!match){
            return res.status(400).json({error: 'Authentication filed'});
        }

        const token = jwt.sign({userInfo: user}, process.env.JWT_PRIVATE_KEY, { algorithm: 'RS256' });

        return token;

    } catch (e) {
        return res.status(500).json({error: 'Error trying to authenticate client'});
    }
}

const auth = {
    authenticate
}

export default auth;