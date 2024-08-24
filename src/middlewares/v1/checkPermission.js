import roleShemma from "#models/v1/roles.js";
import jwt from "jsonwebtoken";

const CheckUserPermission = (requiredPermissions) => {
    return async (req, res, next) => {
        try {

            const decodedToken = jwt.verify(req.token, process.env.JWT_PRIVATE_KEY);

            if (!decodedToken || !decodedToken.userInfo || !decodedToken.userInfo.idRole) {
                return res.status(403).json({ error: 'Invalid token or missing role information' });
            }

            const userRole = await roleShemma.findById(decodedToken.userInfo.idRole).populate('actions');

            if (!userRole || !userRole.enabled) {
                return res.status(403).json({ error: 'Role not found or not enabled' });
            }

            const userActions = userRole.actions.map(action => action.name);
            const hasAllPermisions = requiredPermissions.every(permission => userActions.includes(permission));

            if(!hasAllPermisions){
                return res.status(403).json({ error: 'You do not have sufficient permissions to perform this action' });
            }

            next();

        } catch (e) {
            return res.status(500).json({ error: 'Error tryin to validate permissions: ' + e });
        }
    }
}

export { CheckUserPermission };