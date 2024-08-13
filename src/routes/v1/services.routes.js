import { Router } from "express";
import main from '#controllers/v1/main.controller.js';
const servicesController = main.servicesController;

const route = Router();

route.get('/', servicesController.getServices);

route.post('/new_service', servicesController.addService);

route.put('/update_service/:id', servicesController.updateService);

route.post('/disabled_service/:id', servicesController.disabledService);

export default route;