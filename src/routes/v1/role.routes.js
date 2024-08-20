import { Router } from "express";
import main from '#controllers/v1/main.controller.js';
import {isAuthenticated} from "#middlewares/v1/isAuthenticated.js";
const roleController = main.roleController;

const route = Router();

route.get('/', roleController.getRoles);

route.post('/new_role', isAuthenticated, roleController.addRole);

route.put('/update_role/:id', isAuthenticated, roleController.updateRole);

route.put('/disabled_role/:id', isAuthenticated, roleController.disabledRole);

route.put('/enabled_role/:id', isAuthenticated, roleController.enabledRole);

export default route;