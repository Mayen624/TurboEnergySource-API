import { Router } from "express";
import main from '#controllers/v1/main.controller.js';
import {isAuthenticated} from "#middlewares/v1/isAuthenticated.js";
import {CheckUserPermission} from "#middlewares/v1/checkPermission.js"
const contactController = main.contactController;

const route = Router();

route.get('/', isAuthenticated, contactController.getContacts);

route.post('/new_contact', contactController.addContact);

route.put('/update_contact/:id', isAuthenticated, CheckUserPermission(['update']), contactController.updateContact);

route.put('/enabledOrDesabled/:id', isAuthenticated, CheckUserPermission(['update','enabled']), contactController.enabledOrDisabledContact);

export default route;