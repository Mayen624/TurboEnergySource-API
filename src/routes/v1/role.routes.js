import { Router } from "express";
import main from '#controllers/v1/main.controller.js';
const roleController = main.roleController;

const route = Router();

route.get('/', roleController.getRoles);

route.post('/new_role', roleController.addRole);

route.put('/update_role/:id', roleController.updateRole);

route.put('/disabled_role/:id', roleController.disabledRole);

route.put('/enabled_role/:id', roleController.enabledRole);

export default route;