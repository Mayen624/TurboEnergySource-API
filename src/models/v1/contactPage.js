import mongoose from "mongoose";

const { model, Schema } = mongoose;

const contactPageSchema = new Schema({
    // Main title and subtitle
    title: {
        type: String,
        default: 'Contactenos',
        required: true
    },
    subTitle: {
        type: String,
        default: 'Tiene preguntas o quiere discutir un proyecto? Comuníquese y creemos la solución perfecta con nuestras herramientas y servicios.',
        required: false
    },

    // Block 1: Knowledge Base
    knowledgeBase: {
        heading: {
            type: String,
            default: 'Base de conocimientos'
        },
        content: {
            type: String,
            default: 'Explore todos los artículos de nuestra base de conocimientos.'
        },
        linkTitle: {
            type: String,
            default: 'Guías de visita y tutoriales'
        }
    },

    // Block 2: FAQ
    faq: {
        heading: {
            type: String,
            default: 'FAQ'
        },
        content: {
            type: String,
            default: 'Explore nuestras preguntas frecuentes para obtener respuestas rápidas y claras a consultas comunes.'
        },
        linkTitle: {
            type: String,
            default: 'Visit FAQ'
        }
    },

    // Block 3: Office
    office: {
        heading: {
            type: String,
            default: 'Visite nuestras oficinas'
        },
        content: {
            type: String,
            default: 'UK ScrewFast'
        },
        address: {
            type: String,
            default: '72 Union Terrace, E10 4PE London'
        }
    },

    // Block 4: Email
    email: {
        heading: {
            type: String,
            default: 'Contactenos via email'
        },
        content: {
            type: String,
            default: 'Prefieres la palabra escrita? Envíanos un correo electrónico a'
        },
        emailAddress: {
            type: String,
            default: 'support@screwfast.uk'
        }
    },

    updatedBy: { type: mongoose.Types.ObjectId, default: null, ref: 'User' }
}, { timestamps: true });

// Single document pattern - only one contact page config
contactPageSchema.statics.getPageContent = async function() {
    let pageContent = await this.findOne();
    if (!pageContent) {
        // Create default content if not exists
        pageContent = await this.create({
            title: 'Contactenos',
            subTitle: 'Tiene preguntas o quiere discutir un proyecto? Comuníquese y creemos la solución perfecta con nuestras herramientas y servicios.',
            knowledgeBase: {
                heading: 'Base de conocimientos',
                content: 'Explore todos los artículos de nuestra base de conocimientos.',
                linkTitle: 'Guías de visita y tutoriales'
            },
            faq: {
                heading: 'FAQ',
                content: 'Explore nuestras preguntas frecuentes para obtener respuestas rápidas y claras a consultas comunes.',
                linkTitle: 'Visit FAQ'
            },
            office: {
                heading: 'Visite nuestras oficinas',
                content: 'UK ScrewFast',
                address: '72 Union Terrace, E10 4PE London'
            },
            email: {
                heading: 'Contactenos via email',
                content: 'Prefieres la palabra escrita? Envíanos un correo electrónico a',
                emailAddress: 'support@screwfast.uk'
            }
        });
    }
    return pageContent;
};

const ContactPage = model('ContactPage', contactPageSchema);

export default ContactPage;
