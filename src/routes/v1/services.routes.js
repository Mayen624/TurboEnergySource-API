import { Router } from "express";
import main from '#controllers/v1/main.controller.js';
import { isAuthenticated } from "#middlewares/v1/isAuthenticated.js";
import {CheckUserPermission} from "#middlewares/v1/checkPermission.js";
import {csrfProtection} from "#middlewares/v1/csrfProtection.js";
const servicesController = main.servicesController;

const route = Router();

route.get('/', isAuthenticated, csrfProtection, servicesController.getServices);

route.post('/new_service', isAuthenticated, csrfProtection, CheckUserPermission(['create:service']), servicesController.addService);

route.put('/update_service/:id', isAuthenticated, csrfProtection, CheckUserPermission(['edit:service']), servicesController.updateService);

route.post('/disabled_service/:id', isAuthenticated, csrfProtection, CheckUserPermission(['disabled:service', 'enabled:service']), servicesController.disabledService);

export default route;