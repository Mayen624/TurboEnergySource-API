import { Router } from "express";
import main from '#controllers/v1/main.controller.js';
import {isAuthenticated} from "#middlewares/v1/isAuthenticated.js";
import {CheckUserPermission} from "#middlewares/v1/checkPermission.js";
import {csrfProtection} from "#middlewares/v1/csrfProtection.js";
const actionController = main.actionsController;

const route = Router();

route.get('/', isAuthenticated, csrfProtection, CheckUserPermission(['view:actions']), actionController.getActions);

route.post('/new_action', isAuthenticated, csrfProtection, CheckUserPermission(['create:actions']), actionController.addAction);

route.put('/update_action/:id', isAuthenticated, csrfProtection, CheckUserPermission(['edit:actions']), actionController.updateAction);

route.put('/enabledOrDesabled/:id', isAuthenticated, csrfProtection, CheckUserPermission(['enabled:actions','disabled:actions']), actionController.enabledOrDisabled);

export default route;