import validator from "#utils/v1/validator.js";
import userShemma from "#models/v1/users.js";

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
        
        const match = bicrypt.compareHash(password, user.password);

        if(!match){
            return res.status(400).json({error: 'Authentication filed'});
        }

        const token = jwt.sign({userInfo: user}, process.env.JWT_PRIVATE_KEY, { algorithm: 'RS256' });

        return res.status(200).json({success: 'Success authentication', token});

    } catch (e) {
        return res.status(500).json({error: e});
    }

}

const authController = {authenticateClient};

export default authController;

