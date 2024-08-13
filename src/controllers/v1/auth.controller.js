import validator from "#utils/v1/validator.js";
import userShemma from "#models/v1/users.js";
import auth from "#utils/v1/auth.js";

const authenticateClient = async (req, res) => {

    try {
        const {email, password} = req.body;

        if(!validator.isNonEmptyString(email) || !validator.isNonEmptyString(password)){
            return res.status(400).json({error: 'Email and password requiered'});
        }

        const token = auth.authenticate(email, password);
        return res.status(200).json({success: 'Success authentication', token})

    } catch (e) {
        return res.status(500).json({error: e});
    }

}

const authController = {authenticateClient};

export default authController;

