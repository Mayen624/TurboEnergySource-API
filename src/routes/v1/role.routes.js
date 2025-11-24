import { Router } from "express";
import main from '#controllers/v1/main.controller.js';
import {isAuthenticated} from "#middlewares/v1/isAuthenticated.js";
import {CheckUserPermission} from "#middlewares/v1/checkPermission.js";
import {csrfProtection} from "#middlewares/v1/csrfProtection.js";
const roleController = main.roleController;

const route = Router();

route.get('/', isAuthenticated, csrfProtection, CheckUserPermission(['view:roles']), roleController.getRoles);

route.get('/:id', isAuthenticated, csrfProtection, CheckUserPermission(['view:roles']), roleController.getRoleById);

route.post('/new_role', isAuthenticated, csrfProtection, CheckUserPermission(['create:roles']), roleController.addRole);

route.put('/:id', isAuthenticated, csrfProtection, CheckUserPermission(['edit:roles']), roleController.updateRole);

route.put('/enabledOrDesabled/:id', isAuthenticated, csrfProtection, CheckUserPermission(['disabled:roles', 'enabled:roles']), roleController.enabledOrDisabled);

export default route;