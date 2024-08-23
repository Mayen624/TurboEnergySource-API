import validator from "#utils/v1/validator.js";
import userShemma from "#models/v1/users.js";
import bicrypt from "#utils/v1/bicrypt.js";
import jwt from "jsonwebtoken";

const authenticateClient = async (req, res) => {

    try {
        const {email, password} = req.body;

        if(!validator.isNonEmptyString(email) || !validator.isNonEmptyString(password)){
            return res.status(400).json({error: 'Email or password not valid'});
        }

        const user = await userShemma.findOne({email: email});
    
        if(!user){
            return res.status(404).json({error: 'The user was not found or dosn´t exist'});
        }
        
        const match = awaitbicrypt.compareHash(password, user.password);

        if(!match){
            return res.status(400).json({error: 'Authentication filed'});
        }

        console.log(process.env.JWT_PRIVATE_KEY)
        const token = jwt.sign({userInfo: user}, process.env.JWT_PRIVATE_KEY, { expiresIn: '3600s' });

        return res.status(200).json({success: 'Success authentication', token});

    } catch (e) {
        console.log(e)
        return res.status(500).json({error: e.message});
    }

}

const authController = {authenticateClient};

export default authController;

