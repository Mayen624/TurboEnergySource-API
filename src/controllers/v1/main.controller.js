import authControler from '#controllers/v1/auth.controller.js';
import userController from '#controllers/v1/user.controller.js';
import roleController from '#controllers/v1/role.controller.js';
import actionsController from '#controllers/v1/actions.controller.js';
import productsController from '#controllers/v1/products.controller.js';
import servicesController from '#controllers/v1/services.controller.js';
import contactController from '#controllers/v1/contact.controller.js';
import settingsController from '#controllers/v1/settings.controller.js';
import contactPageController from '#controllers/v1/contactPage.controller.js';
import aboutPageController from '#controllers/v1/aboutPage.controller.js';

const mainController = {
    authControler,
    userController,
    roleController,
    actionsController,
    productsController,
    servicesController,
    contactController,
    settingsController,
    contactPageController,
    aboutPageController
}

export default mainController;