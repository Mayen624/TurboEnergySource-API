import userShemma from '#models/v1/users.js';
import validator from '#utils/v1/validator.js';
import bicrypt from '#utils/v1/bicrypt.js';
import validateData from "#utils/v1/ValidateData.js";
import {paginate} from "#utils/v1/functions.js";

const getUsers = async (req,res) => {

    try {
        const { page = 1, limit = 10 } = req.query;

        const paginateData = await paginate(actionsShemma, page, limit);

        if(paginateData.error) {return res.status(500).json({error: paginateData.error})}
        
        return res.status(200).json(
            {   
                limit: limit,
                users: paginateData.data, 
                total : paginateData.total, 
                totalPages : paginateData.totalPages, 
                currentPage: paginateData.currentPage, 
            }
        );

    } catch (e) {
        return res.status(500).json({error: "Error obteniendo usuarios"});
    }
}

const getUsersBySSE = async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const { page = 1, limit = 10 } = req.query;
    const token = req.query.token;

    try {
        const SSEValidation = await validateData.validateSSEData(token);

        if (!SSEValidation.isValid) {
            res.write(`data: ${JSON.stringify({ error: SSEValidation.errors })}\n\n`);
            res.status(401).end();
            return;
        }

        // Función de paginación
        const paginate = async (page, limit) => {
            const pageNumber = parseInt(page, 10) || 1;
            const limitNumber = parseInt(limit, 10) || 10;
            const skip = (pageNumber - 1) * limitNumber;

            const data = await userShemma.find().skip(skip).limit(limitNumber);
            const total = await userShemma.countDocuments();
            const totalPages = Math.ceil(total / limitNumber);

            return {
                data, total, totalPages, currentPage: pageNumber, limit: limitNumber,
            };
        };

        // Enviar la primera página
        const initialData = await paginate(page, limit);
        res.write(`data: ${JSON.stringify(initialData)}\n\n`);

        // Intervalo para datos en tiempo real
        const intervalId = setInterval(async () => {
            try {
                const updatedData = await paginate(page, limit);
                res.write(`data: ${JSON.stringify(updatedData)}\n\n`);
            } catch (error) {
                res.write(`data: ${JSON.stringify({ error: "Error obteniendo datos: " + error.message })}\n\n`);
            }
        }, 3500);

        // Limpiar el intervalo cuando se cierra la conexión
        req.on('close', () => {
            clearInterval(intervalId);
            res.end();
        });

    } catch (e) {
        res.write(`data: ${JSON.stringify({ error: "Error obteniendo usuarios: " + e.message })}\n\n`);
        res.status(500).end();
    }
};


const createUser = async (req,res) => {
    try {
        
        const {name, email, password, idRole} = req.body;

        const valData = await validateData.validateUserData(req.body);
        
        if(!valData.isValid){
            return res.status(400).json({errors: valData.errors});
        }

        const passwordHashed = await bicrypt.generateHash(password);

        const newUser = new userShemma({
            name    : name,
            email   : email,
            password: passwordHashed,
            idRole  : idRole,
        });

        await newUser.save();
        return res.status(200).json({success: 'Usuario creado exitosamente'});

    } catch (e) {
        return res.status(500).json({error: 'Error creando un usuario , intente de nuevo: ' + e.message});
    }
}

const updateUser = async (req,res) => {

    const {id} = req.params;
    const {name, email, idRole, enabled} = req.body;

    if(!validator.isValidObjectId(id)) { 
        return res.status(404).json({error: "usuario  id es requerido"});
    }

    if(!validator.isValidEmail(email)){
        return res.status(404).json({error: 'Email no valido'});
    }

    if(!validator.isValidObjectId(idRole)){
        return res.status(404).json({error: 'Rol no valido'});
    }

    const user = await userShemma.findByIdAndUpdate(id, {name: name, email: email, idRole: idRole, enabled: enabled});

    if(!user){
        return res.status(404).json({error: "El usuario no pudo ser actualizado porque no se encontro"});
    }

    return res.status(200).json({success: "Usuario actualizado exitosamente"});
}

const enabledOrDisabled = async (req,res) => {

    const {id} = req.params;
    const {enabled} = req.body;

    if(!validator.isValidObjectId(id)){
        return res.status(404).json({error: "Id not valid"});
    }

    if(enabled === undefined || enabled === null){
        return res.status(404).json('valor requerido');
    }

    const user = await userShemma.findByIdAndUpdate(id, {enabled: enabled});

    if(!user){
        return res.status(404).json({error: "El usuario no pudo ser actualizado porque no se encontro"});
    }

    const message = enabled === false ? 'El usuario ha sido desactivado' : 'El usuario ha sido activado';
    return res.status(200).json({success: message });
}


const userController = {
    getUsers,
    createUser,
    updateUser,
    getUsersBySSE,
    enabledOrDisabled
}

export default userController;