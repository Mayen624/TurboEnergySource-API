import { Router } from "express";
import main from '#controllers/v1/main.controller.js';
import { isAuthenticated } from "#middlewares/v1/isAuthenticated.js";
import { CheckUserPermission } from "#middlewares/v1/checkPermission.js";
import { csrfProtection } from "#middlewares/v1/csrfProtection.js";
const contactPageController = main.contactPageController;

const route = Router();

// Public endpoint - no authentication required (for landing page)
route.get('/public', contactPageController.getPublicContactPage);

// Protected endpoints - require authentication
route.get('/', isAuthenticated, csrfProtection, contactPageController.getContactPage);

route.put('/', isAuthenticated, csrfProtection, CheckUserPermission(['edit:pages']), contactPageController.updateContactPage);

export default route;
