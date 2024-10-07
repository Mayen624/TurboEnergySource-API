import { Router } from "express";
import main from '#controllers/v1/main.controller.js';
import {isAuthenticated} from "#middlewares/v1/isAuthenticated.js";
import {CheckUserPermission} from "#middlewares/v1/checkPermission.js"
const roleController = main.roleController;

const route = Router();

route.get('/', isAuthenticated, roleController.getRoles);

route.post('/new_role', isAuthenticated, CheckUserPermission(['add']), roleController.addRole);

route.put('/update_role/:id', isAuthenticated, CheckUserPermission(['update']), roleController.updateRole);

route.put('/enabledOrDesabled/:id', isAuthenticated, CheckUserPermission(['update']), roleController.enabledOrDisabled);

export default route;