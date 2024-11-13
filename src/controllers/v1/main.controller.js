import authControler from '#controllers/v1/auth.controller.js';
import userController from '#controllers/v1/user.controller.js';
import roleController from '#controllers/v1/role.controller.js';
import actionsController from '#controllers/v1/actions.controller.js';
import productsController from '#controllers/v1/products.controller.js';
import servicesController from '#controllers/v1/services.controller.js';
import contactController from '#controllers/v1/contact.controller.js';

const mainController = {
    authControler,
    userController,
    roleController,
    actionsController,
    productsController,
    servicesController,
    contactController
}

export default mainController;