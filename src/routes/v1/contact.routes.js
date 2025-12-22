import { Router } from "express";
import main from '#controllers/v1/main.controller.js';
import {isAuthenticated} from "#middlewares/v1/isAuthenticated.js";
import {CheckUserPermission} from "#middlewares/v1/checkPermission.js";
import {CheckReCaptchaResponse} from "#middlewares/v1/checkReCaptcha.js";
import {csrfProtection} from "#middlewares/v1/csrfProtection.js";
const contactController = main.contactController;

const route = Router();

route.get('/', isAuthenticated, csrfProtection, contactController.getContacts);

route.get('/approved', isAuthenticated, csrfProtection, contactController.getApprovedContacts);

route.get('/stats', isAuthenticated, csrfProtection, contactController.getContactStats);

route.get('/:id', isAuthenticated, csrfProtection, contactController.getContactById);

route.post('/new_contact', CheckReCaptchaResponse, contactController.addContact);

route.put('/update_contact/:id', isAuthenticated, csrfProtection, CheckUserPermission(['tracking:contact']), contactController.updateContact);

route.put('/update_status/:id', isAuthenticated, csrfProtection, CheckUserPermission(['tracking:contact']), contactController.updateContactStatus);

route.put('/approve/:id', isAuthenticated, csrfProtection, CheckUserPermission(['tracking:contact']), contactController.approveContact);

route.post('/add_note/:id', isAuthenticated, csrfProtection, CheckUserPermission(['tracking:contact']), contactController.addContactNote);

route.post('/send_email', isAuthenticated, csrfProtection, CheckUserPermission(['tracking:contact']), contactController.sendEmailToContactClient);

route.put('/enabledOrDesabled/:id', isAuthenticated, csrfProtection, CheckUserPermission(['disabled:contact','enabled:contact']), contactController.enabledOrDisabledContact);

export default route;