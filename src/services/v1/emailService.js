import nodemailer from 'nodemailer';

// Función para obtener el transportador de Mailcow SMTP - Contacto (seguimiento manual)
function getContactoTransporter() {
    if (!process.env.SMTP_HOST || !process.env.SMTP_CONTACTO_USER || !process.env.SMTP_CONTACTO_PASS) {
        console.warn('⚠️ Configuración SMTP de Contacto incompleta. Los emails no se enviarán.');
        return null;
    }

    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_CONTACTO_USER,
            pass: process.env.SMTP_CONTACTO_PASS
        },
        tls: {
            rejectUnauthorized: false // Acepta certificados autofirmados de Mailcow
        }
    });
}

// Función para obtener el transportador de Mailcow SMTP - NoReply (emails automáticos)
function getNoReplyTransporter() {
    if (!process.env.SMTP_HOST || !process.env.SMTP_NOREPLY_USER || !process.env.SMTP_NOREPLY_PASS) {
        console.warn('⚠️ Configuración SMTP de NoReply incompleta. Los emails no se enviarán.');
        return null;
    }

    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_NOREPLY_USER,
            pass: process.env.SMTP_NOREPLY_PASS
        },
        tls: {
            rejectUnauthorized: false // Acepta certificados autofirmados de Mailcow
        }
    });
}

/**
 * Send email to a client using Mailcow SMTP
 * @param {Object} emailData - Email data
 * @param {string} emailData.to - Recipient email
 * @param {string} emailData.toName - Recipient name
 * @param {string} emailData.subject - Email subject
 * @param {string} emailData.message - Email message (plain text)
 * @param {string} emailData.fromName - Sender name (optional)
 * @returns {Promise<Object>} - Response
 */
export async function sendEmailToClient(emailData) {
    try {
        console.log('[emailService] Iniciando envío de email con Mailcow (Contacto)...');

        // Obtener transportador de Contacto (seguimiento manual)
        const transporter = getContactoTransporter();

        if (!transporter) {
            console.error('[emailService] Mailcow SMTP Contacto no configurado');
            return {
                success: false,
                error: 'Servicio de email no configurado. Configura SMTP Contacto en .env'
            };
        }

        console.log('✅ [emailService] Transportador Contacto creado correctamente');

        const { to, toName, subject, message, fromName = process.env.SMTP_CONTACTO_FROM_NAME || 'TurboEnergy - Contacto' } = emailData;

        console.log('📧 [emailService] Datos del email:');
        console.log('   From:', `${fromName} <${process.env.SMTP_CONTACTO_FROM_EMAIL}>`);
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

        console.log('[emailService] Enviando email a través de Mailcow SMTP...');

        // Configurar opciones del email
        const mailOptions = {
            from: `"${fromName}" <${process.env.SMTP_CONTACTO_FROM_EMAIL}>`,
            to: to,
            subject: subject,
            text: message, // Versión texto plano
            html: htmlContent // Versión HTML
        };

        // Enviar email usando nodemailer
        const info = await transporter.sendMail(mailOptions);

        console.log('✅ [emailService] Email enviado exitosamente. MessageID:', info.messageId);

        return {
            success: true,
            messageId: info.messageId,
            data: info
        };

    } catch (error) {
        console.error('❌ [emailService] Error sending email with Mailcow:');
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
 * @returns {Promise<Object>} - Response
 */
export async function sendAdminNotification(contactData) {
    try {
        // Obtener transportador de NoReply (emails automáticos)
        const transporter = getNoReplyTransporter();

        if (!transporter) {
            console.warn('⚠️ No se pudo enviar notificación de admin: NoReply no configurado');
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

        const mailOptions = {
            from: `"TurboEnergy Notifications" <${process.env.SMTP_NOREPLY_FROM_EMAIL}>`,
            to: process.env.ADMIN_EMAIL || 'admin@turboenergy.com',
            subject: `Nuevo contacto: ${firstName} ${lastName}`,
            html: htmlContent
        };

        const info = await transporter.sendMail(mailOptions);

        return {
            success: true,
            messageId: info.messageId
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
