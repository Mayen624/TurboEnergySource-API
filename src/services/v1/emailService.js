import { Resend } from 'resend';

// Función para obtener la instancia de Resend (lazy loading)
function getResendClient() {
    if (!process.env.RESEND_API_KEY) {
        console.warn('⚠️ RESEND_API_KEY no configurada. Los emails no se enviarán.');
        return null;
    }
    return new Resend(process.env.RESEND_API_KEY);
}

/**
 * Send email to a client using Resend
 * @param {Object} emailData - Email data
 * @param {string} emailData.to - Recipient email
 * @param {string} emailData.toName - Recipient name
 * @param {string} emailData.subject - Email subject
 * @param {string} emailData.message - Email message (plain text)
 * @param {string} emailData.fromName - Sender name (optional)
 * @returns {Promise<Object>} - Response from Resend
 */
export async function sendEmailToClient(emailData) {
    try {
        console.log('📨 [emailService] Iniciando envío de email...');

        // Obtener cliente de Resend
        const resend = getResendClient();

        if (!resend) {
            console.error('❌ [emailService] Resend no configurado');
            return {
                success: false,
                error: 'Servicio de email no configurado. Configura RESEND_API_KEY en .env'
            };
        }

        console.log('✅ [emailService] Cliente Resend obtenido correctamente');

        const { to, toName, subject, message, fromName = 'TurboEnergy' } = emailData;

        console.log('📧 [emailService] Datos del email:');
        console.log('   From:', fromName);
        console.log('   To:', to);
        console.log('   Subject:', subject);

        // Validar campos requeridos
        if (!to || !subject || !message) {
            throw new Error('Faltan campos requeridos: to, subject, message');
        }

        // HTML template básico pero profesional
        const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
        }
        .email-header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .email-body {
            padding: 30px 20px;
        }
        .email-body p {
            margin: 0 0 15px 0;
            white-space: pre-wrap;
        }
        .email-footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6c757d;
            border-top: 1px solid #e9ecef;
        }
        .email-footer a {
            color: #667eea;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>TurboEnergy</h1>
        </div>
        <div class="email-body">
            <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
        <div class="email-footer">
            <p><strong>TurboEnergy</strong></p>
            <p>Este mensaje fue enviado desde nuestro sistema de gestión de clientes.</p>
            <p>Si tiene alguna pregunta, responda directamente a este correo.</p>
        </div>
    </div>
</body>
</html>
        `.trim();

        console.log('🚀 [emailService] Enviando email a través de Resend API...');

        // Enviar email usando Resend
        const response = await resend.emails.send({
            from: `${fromName} <onboarding@resend.dev>`, // En producción cambiar por tu dominio verificado
            to: [to],
            subject: subject,
            html: htmlContent,
            text: message, // Fallback para clientes que no soportan HTML
        });

        console.log('✅ [emailService] Respuesta de Resend:', response);

        // Verificar si Resend retornó un error (plan gratuito sin dominio verificado)
        if (response.error) {
            console.error('❌ [emailService] Resend retornó error:', response.error);

            let errorMessage = response.error.message || 'Error desconocido';

            // Mensaje más amigable para el error de testing
            if (errorMessage.includes('testing emails')) {
                errorMessage = '⚠️ Plan gratuito: Solo puedes enviar a tu email (mayen624.dev@gmail.com). Verifica un dominio en resend.com/domains para enviar a otros destinatarios.';
            }

            return {
                success: false,
                error: errorMessage,
                resendError: response.error
            };
        }

        // Extraer el ID correctamente de la respuesta
        const messageId = response.data?.id || response.id;

        console.log('✅ [emailService] Email enviado exitosamente. MessageID:', messageId);

        return {
            success: true,
            messageId: messageId,
            data: response
        };

    } catch (error) {
        console.error('❌ [emailService] Error sending email with Resend:');
        console.error('   Error name:', error.name);
        console.error('   Error message:', error.message);
        console.error('   Full error:', error);
        return {
            success: false,
            error: error.message || 'Error al enviar el correo'
        };
    }
}

/**
 * Send notification email to admin when a new contact is created
 * @param {Object} contactData - Contact data
 * @returns {Promise<Object>} - Response from Resend
 */
export async function sendAdminNotification(contactData) {
    try {
        // Obtener cliente de Resend
        const resend = getResendClient();

        if (!resend) {
            console.warn('⚠️ No se pudo enviar notificación de admin: Resend no configurado');
            return {
                success: false,
                error: 'Servicio de email no configurado'
            };
        }

        const { firstName, lastName, email, phone, details } = contactData;

        const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nuevo Contacto - TurboEnergy</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
        }
        .email-header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .email-body {
            padding: 30px 20px;
        }
        .contact-info {
            background-color: #f8f9fa;
            border-left: 4px solid #10b981;
            padding: 15px;
            margin: 20px 0;
        }
        .contact-info p {
            margin: 8px 0;
        }
        .contact-info strong {
            color: #10b981;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>🔔 Nuevo Cliente Potencial</h1>
        </div>
        <div class="email-body">
            <p>Se ha recibido un nuevo contacto a través del formulario web:</p>
            <div class="contact-info">
                <p><strong>Nombre:</strong> ${firstName} ${lastName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Teléfono:</strong> ${phone}</p>
                <p><strong>Detalles:</strong></p>
                <p>${details}</p>
            </div>
            <p>Puedes responder a este cliente directamente desde tu panel de administración.</p>
        </div>
    </div>
</body>
</html>
        `.trim();

        const response = await resend.emails.send({
            from: 'TurboEnergy Notifications <onboarding@resend.dev>',
            to: [process.env.ADMIN_EMAIL || 'admin@turboenergy.com'], // Email del admin
            subject: `Nuevo contacto: ${firstName} ${lastName}`,
            html: htmlContent
        });

        return {
            success: true,
            messageId: response.id
        };

    } catch (error) {
        console.error('Error sending admin notification:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

export default {
    sendEmailToClient,
    sendAdminNotification
};
