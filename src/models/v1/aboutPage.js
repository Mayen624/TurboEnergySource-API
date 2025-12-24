import mongoose from "mongoose";

const { model, Schema } = mongoose;

const aboutPageSchema = new Schema({
    // Section 1: Quiénes Somos
    quienesSomos: {
        title: {
            type: String,
            default: '¿Quiénes Somos?'
        },
        paragraph1: {
            type: String,
            default: 'Somos una empresa 100% salvadoreña con personal altamente calificado, comprometida con las áreas de generación y transmisión de energía eléctrica.'
        },
        paragraph2: {
            type: String,
            default: 'Contamos con experiencia en fabricación, distribución, venta, reparación y mantenimiento de equipos industriales, brindando soluciones integrales que cumplen con los más altos estándares de calidad.'
        },
        highlights: [{
            text: { type: String }
        }]
    },

    // Section 2: Misión y Visión
    misionVision: {
        sectionTitle: {
            type: String,
            default: 'Nuestra Esencia'
        },
        sectionSubtitle: {
            type: String,
            default: 'Lo que nos define y hacia dónde nos dirigimos'
        },
        mision: {
            title: {
                type: String,
                default: 'Misión'
            },
            content: {
                type: String,
                default: 'Proporcionar soluciones y servicios a través de la fabricación, distribución, venta, reparación y mantenimiento de equipos industriales, asegurando la satisfacción de nuestros clientes mediante productos de alta calidad y un servicio excepcional.'
            }
        },
        vision: {
            title: {
                type: String,
                default: 'Visión'
            },
            content: {
                type: String,
                default: 'Ser líderes en el mercado eléctrico, ofreciendo soluciones innovadoras y sostenibles que impulsen el desarrollo industrial de El Salvador y la región centroamericana.'
            }
        }
    },

    // Section 3: Compromisos
    compromisos: {
        sectionTitle: {
            type: String,
            default: 'Nuestros Compromisos'
        },
        sectionSubtitle: {
            type: String,
            default: 'Valores que guían cada una de nuestras acciones y decisiones'
        },
        items: [{
            title: { type: String },
            description: { type: String },
            icon: { type: String, default: 'shield' } // shield, clock, users, bolt
        }]
    },

    // Section 4: Política de Calidad
    politicaCalidad: {
        badgeText: {
            type: String,
            default: 'Política de Calidad'
        },
        title: {
            type: String,
            default: 'Compromiso con la Excelencia'
        },
        description: {
            type: String,
            default: 'Nuestra política de calidad se fundamenta en la mejora continua de todos nuestros procesos, garantizando productos y servicios que superen las expectativas de nuestros clientes.'
        },
        points: [{
            text: { type: String }
        }],
        stats: [{
            value: { type: String },
            label: { type: String }
        }]
    },

    // Section 5: Por qué Elegirnos
    porQueElegirnos: {
        sectionTitle: {
            type: String,
            default: '¿Por qué Elegirnos?'
        },
        sectionSubtitle: {
            type: String,
            default: 'Descubre las razones por las que somos la mejor opción para tus proyectos'
        },
        reasons: [{
            title: { type: String },
            description: { type: String },
            icon: { type: String, default: 'tools' } // tools, education, badge
        }]
    },

    updatedBy: { type: mongoose.Types.ObjectId, default: null, ref: 'User' }
}, { timestamps: true });

// Single document pattern - only one about page config
aboutPageSchema.statics.getPageContent = async function() {
    let pageContent = await this.findOne();
    if (!pageContent) {
        // Create default content if not exists
        pageContent = await this.create({
            quienesSomos: {
                title: '¿Quiénes Somos?',
                paragraph1: 'Somos una empresa 100% salvadoreña con personal altamente calificado, comprometida con las áreas de generación y transmisión de energía eléctrica.',
                paragraph2: 'Contamos con experiencia en fabricación, distribución, venta, reparación y mantenimiento de equipos industriales, brindando soluciones integrales que cumplen con los más altos estándares de calidad.',
                highlights: [
                    { text: 'Personal Calificado' },
                    { text: 'Soluciones Integrales' },
                    { text: 'Alta Calidad' },
                    { text: 'Innovación Constante' }
                ]
            },
            misionVision: {
                sectionTitle: 'Nuestra Esencia',
                sectionSubtitle: 'Lo que nos define y hacia dónde nos dirigimos',
                mision: {
                    title: 'Misión',
                    content: 'Proporcionar soluciones y servicios a través de la fabricación, distribución, venta, reparación y mantenimiento de equipos industriales, asegurando la satisfacción de nuestros clientes mediante productos de alta calidad y un servicio excepcional.'
                },
                vision: {
                    title: 'Visión',
                    content: 'Ser líderes en el mercado eléctrico, ofreciendo soluciones innovadoras y sostenibles que impulsen el desarrollo industrial de El Salvador y la región centroamericana.'
                }
            },
            compromisos: {
                sectionTitle: 'Nuestros Compromisos',
                sectionSubtitle: 'Valores que guían cada una de nuestras acciones y decisiones',
                items: [
                    { title: 'Calidad Garantizada', description: 'Productos y servicios que cumplen con los más altos estándares internacionales.', icon: 'shield' },
                    { title: 'Entrega Puntual', description: 'Cumplimos con los plazos acordados, respetando su tiempo y proyectos.', icon: 'clock' },
                    { title: 'Servicio Personalizado', description: 'Atención dedicada a cada cliente, entendiendo sus necesidades específicas.', icon: 'users' },
                    { title: 'Innovación Continua', description: 'Siempre a la vanguardia con tecnología y procesos de última generación.', icon: 'bolt' }
                ]
            },
            politicaCalidad: {
                badgeText: 'Política de Calidad',
                title: 'Compromiso con la Excelencia',
                description: 'Nuestra política de calidad se fundamenta en la mejora continua de todos nuestros procesos, garantizando productos y servicios que superen las expectativas de nuestros clientes.',
                points: [
                    { text: 'Cumplimiento de normativas y estándares internacionales' },
                    { text: 'Capacitación constante de nuestro personal técnico' },
                    { text: 'Control riguroso en cada etapa del proceso productivo' },
                    { text: 'Seguimiento y retroalimentación con cada cliente' }
                ],
                stats: [
                    { value: '100%', label: 'Salvadoreña' },
                    { value: '24/7', label: 'Soporte Técnico' },
                    { value: '+500', label: 'Proyectos' },
                    { value: '+15', label: 'Años de Experiencia' }
                ]
            },
            porQueElegirnos: {
                sectionTitle: '¿Por qué Elegirnos?',
                sectionSubtitle: 'Descubre las razones por las que somos la mejor opción para tus proyectos',
                reasons: [
                    { title: 'Experiencia Comprobada', description: 'Más de 15 años brindando soluciones eléctricas industriales en El Salvador y la región.', icon: 'tools' },
                    { title: 'Equipo Profesional', description: 'Personal altamente capacitado y certificado en las últimas tecnologías del sector.', icon: 'education' },
                    { title: 'Garantía de Calidad', description: 'Respaldamos cada proyecto con garantías reales y soporte técnico continuo.', icon: 'badge' }
                ]
            }
        });
    }
    return pageContent;
};

const AboutPage = model('AboutPage', aboutPageSchema);

export default AboutPage;
