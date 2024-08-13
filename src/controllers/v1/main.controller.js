import userController from '#controllers/v1/user.controller.js';
import roleController from '#controllers/v1/role.controller.js';
import actionsController from '#controllers/v1/action.controller.js';

const mainController = {
    userController,
    roleController,
    actionsController
}

export default mainController;