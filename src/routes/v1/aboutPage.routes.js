import { Router } from "express";
import main from '#controllers/v1/main.controller.js';
import { isAuthenticated } from "#middlewares/v1/isAuthenticated.js";
import { CheckUserPermission } from "#middlewares/v1/checkPermission.js";
import { csrfProtection } from "#middlewares/v1/csrfProtection.js";
const aboutPageController = main.aboutPageController;

const route = Router();

// Public endpoint - no authentication required (for landing page)
route.get('/public', aboutPageController.getPublicAboutPage);

// Protected endpoints - require authentication
route.get('/', isAuthenticated, csrfProtection, aboutPageController.getAboutPage);

route.put('/', isAuthenticated, csrfProtection, CheckUserPermission(['edit:pages']), aboutPageController.updateAboutPage);

export default route;
