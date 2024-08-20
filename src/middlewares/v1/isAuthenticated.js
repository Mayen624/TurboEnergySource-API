import validator from "#utils/v1/validator.js";
import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {

    try {
        const {token} = req.body;

        if(!validator.isNonEmptyString(token) || !token){
            return res.status(401).json({error: 'Token for authentication requiered'});
        }

        const decode = await jwt.verify(token, process.env.JWT_PRIVATE_KEY);

        if(!decode){
            throw new Error('Error trying to verify token, token not valid')
        }

        req.token = token;
        next();

    } catch (e) {
        return res.status(500).json({error: 'Error triyng to authenticate client: ' + e.message});
    }



}

export { isAuthenticated };