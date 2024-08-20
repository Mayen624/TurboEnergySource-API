import { Router } from "express";
import main from '#controllers/v1/main.controller.js';
import {isAuthenticated} from "#middlewares/v1/isAuthenticated.js";
const actionController = main.actionsController;

const route = Router();

route.get('/', isAuthenticated, actionController.getActions);

route.post('/new_action', isAuthenticated, actionController.addAction);

route.put('/update_action/:id', isAuthenticated, actionController.updateAction);

route.put('/disabled_action/:id', isAuthenticated, actionController.disabledAction);

route.put('/enabled_action/:id', isAuthenticated, actionController.enabledAction)

export default route;