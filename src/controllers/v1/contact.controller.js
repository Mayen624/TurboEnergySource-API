import contactShemma from "#models/v1/contact.js";
import validateData from "#utils/v1/ValidateData.js";
import {paginate} from "#utils/v1/functions.js";
import { sendEmailToClient } from "#services/v1/emailService.js";

const getContacts = async (req,res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        // Filtrar solo contactos NO aprobados (posibles clientes)
        // Incluir también documentos que no tienen el campo isApproved (contactos antiguos)
        const filters = {
            $or: [
                { isApproved: false },
                { isApproved: { $exists: false } }
            ]
        };

        const paginateData = await paginate(contactShemma, page, limit, filters);

        if(paginateData.error) {return res.status(500).json({error: paginateData.error})}

        return res.status(200).json(
            {
                limit: limit,
                contacts: paginateData.data,
                total : paginateData.total,
                totalPages : paginateData.totalPages,
                currentPage: paginateData.currentPage,
            }
        );
    } catch (e) {
        return res.status(500).json({error: e})
    }
}

const addContact = async (req,res) => {

    try {

        const {firstName, lastName, email, phone, details, captchaResponse} = req.body;

        // Excluir captchaResponse de la validación
        const contactDataToValidate = {
            firstName,
            lastName,
            email,
            phone,
            details
        };

        const valData = await validateData.validateContactData(contactDataToValidate);

        if(!valData.isValid){
            return res.status(400).json({errors: valData.errors});
        }

        const newContact = new contactShemma({
            firstName,
            lastName,
            email,
            phone,
            details,
        });

        await newContact.save();
        return res.status(200).json({success: 'La solicitud fue enviada con exito , espere nuestra respuesta en su correo electronico.'});

    } catch (e) {
        return res.status(500).json({error: 'Error creando un usuario, intente de nuevo: ' + e.message});
    }
}

const updateContact = async (req,res) => {

}

const enabledOrDisabledContact = async (req,res) => {

}

const getContactById = async (req, res) => {
    try {
        const { id } = req.params;

        const contact = await contactShemma.findById(id).populate('assignedTo', 'name email');

        if (!contact) {
            return res.status(404).json({ error: 'Contacto no encontrado' });
        }

        return res.status(200).json({ contact });
    } catch (e) {
        return res.status(500).json({ error: 'Error obteniendo el contacto: ' + e.message });
    }
}

const updateContactStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['nuevo', 'contactado', 'en_proceso', 'cerrado_exitoso', 'cerrado_sin_interes'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Estado no válido' });
        }

        const contact = await contactShemma.findByIdAndUpdate(
            id,
            {
                status,
                lastContactDate: status !== 'nuevo' ? new Date() : null
            },
            { new: true }
        );

        if (!contact) {
            return res.status(404).json({ error: 'Contacto no encontrado' });
        }

        return res.status(200).json({ success: 'Estado actualizado correctamente', contact });
    } catch (e) {
        return res.status(500).json({ error: 'Error actualizando el estado: ' + e.message });
    }
}

const addContactNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { content, createdBy } = req.body;

        if (!content || content.trim() === '') {
            return res.status(400).json({ error: 'El contenido de la nota es requerido' });
        }

        const contact = await contactShemma.findById(id);

        if (!contact) {
            return res.status(404).json({ error: 'Contacto no encontrado' });
        }

        contact.notes.push({
            content: content.trim(),
            createdBy: createdBy || 'Admin',
            createdAt: new Date()
        });

        await contact.save();

        return res.status(200).json({ success: 'Nota agregada correctamente', contact });
    } catch (e) {
        return res.status(500).json({ error: 'Error agregando la nota: ' + e.message });
    }
}

const getContactStats = async (req, res) => {
    try {
        // Filtrar solo contactos NO aprobados para las estadísticas de posibles clientes
        // Incluir también documentos que no tienen el campo isApproved (contactos antiguos)
        const matchFilter = {
            $or: [
                { isApproved: false },
                { isApproved: { $exists: false } }
            ]
        };

        const stats = await contactShemma.aggregate([
            {
                $match: matchFilter
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const total = await contactShemma.countDocuments(matchFilter);

        const statsObj = {
            total,
            nuevo: 0,
            contactado: 0,
            en_proceso: 0,
            cerrado_exitoso: 0,
            cerrado_sin_interes: 0
        };

        stats.forEach(stat => {
            statsObj[stat._id] = stat.count;
        });

        return res.status(200).json({ stats: statsObj });
    } catch (e) {
        return res.status(500).json({ error: 'Error obteniendo estadísticas: ' + e.message });
    }
}

const sendEmailToContactClient = async (req, res) => {
    try {
        const { to, toName, subject, message, contactId } = req.body;

        console.log('📧 Intentando enviar email...');
        console.log('   To:', to);
        console.log('   Subject:', subject);
        console.log('   Message length:', message?.length);

        // Validar campos requeridos
        if (!to || !subject || !message) {
            console.error('❌ Faltan campos requeridos');
            return res.status(400).json({ error: 'Campos requeridos: to, subject, message' });
        }

        // Enviar email
        console.log('🚀 Llamando a sendEmailToClient...');
        const result = await sendEmailToClient({
            to,
            toName,
            subject,
            message
        });

        console.log('📬 Resultado de sendEmailToClient:', result);

        if (!result.success) {
            console.error('❌ Error en sendEmailToClient:', result.error);
            return res.status(400).json({
                success: false,
                error: result.error
            });
        }

        console.log('✅ Email enviado exitosamente. MessageID:', result.messageId);

        // Si se proporciona contactId, agregar una nota automática
        if (contactId) {
            try {
                const contact = await contactShemma.findById(contactId);
                if (contact) {
                    contact.notes.push({
                        content: `Email enviado: "${subject}"`,
                        createdBy: 'Sistema',
                        createdAt: new Date()
                    });
                    contact.lastContactDate = new Date();
                    await contact.save();
                }
            } catch (noteError) {
                console.error('Error adding note:', noteError);
                // No fallar si no se puede agregar la nota
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Email enviado exitosamente',
            messageId: result.messageId
        });

    } catch (e) {
        return res.status(500).json({ error: 'Error enviando email: ' + e.message });
    }
};

const getApprovedContacts = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        // Filtrar solo contactos aprobados
        const query = { isApproved: true };

        const paginateData = await paginate(contactShemma, page, limit, query);

        if (paginateData.error) {
            return res.status(500).json({ error: paginateData.error });
        }

        return res.status(200).json({
            limit: limit,
            contacts: paginateData.data,
            total: paginateData.total,
            totalPages: paginateData.totalPages,
            currentPage: paginateData.currentPage,
        });
    } catch (e) {
        return res.status(500).json({ error: 'Error obteniendo contactos aprobados: ' + e.message });
    }
};

const approveContact = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?._id; // ID del usuario autenticado

        const contact = await contactShemma.findById(id);

        if (!contact) {
            return res.status(404).json({ error: 'Contacto no encontrado' });
        }

        if (contact.isApproved) {
            return res.status(400).json({ error: 'Este contacto ya fue aprobado' });
        }

        contact.isApproved = true;
        contact.approvedAt = new Date();
        contact.approvedBy = userId;
        contact.notes.push({
            content: 'Cliente aprobado y movido a Contactos',
            createdBy: 'Sistema',
            createdAt: new Date()
        });

        await contact.save();

        return res.status(200).json({
            success: true,
            message: 'Contacto aprobado exitosamente',
            contact
        });
    } catch (e) {
        return res.status(500).json({ error: 'Error aprobando el contacto: ' + e.message });
    }
};

const contactController = {
    getContacts,
    getApprovedContacts,
    addContact,
    updateContact,
    enabledOrDisabledContact,
    getContactById,
    updateContactStatus,
    approveContact,
    addContactNote,
    getContactStats,
    sendEmailToContactClient
};

export default contactController;