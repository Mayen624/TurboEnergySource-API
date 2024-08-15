import { Router } from "express";
import main from '#controllers/v1/main.controller.js';
const actionController = main.actionsController;

const route = Router();

route.get('/', actionController.getActions);

route.post('/new_action', actionController.addAction);

route.put('/update_action/:id', actionController.updateAction);

route.put('/disabled_action/:id', actionController.disabledAction);

route.put('/enabled_action/:id', actionController.enabledAction)

export default route;