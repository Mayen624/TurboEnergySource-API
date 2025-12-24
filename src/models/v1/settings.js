import mongoose from "mongoose";

const { model, Schema } = mongoose;

const settingsSchema = new Schema({
    // Tab 1: System Configuration
    system: {
        language: {
            type: String,
            enum: ['es', 'en'],
            default: 'es',
            required: true
        },
        timezone: {
            type: String,
            default: 'America/Mexico_City',
            required: false
        },
        // Otras configuraciones del sistema se pueden agregar aquí
    },

    // Tab 2: Landing Page Visibility Configuration
    landing: {
        // Home Page Components
        homePage: {
            clientsSection: { type: Boolean, default: false },
            featuresGeneral: { type: Boolean, default: false },
            featuresNavs: { type: Boolean, default: false },
            testimonialsSection: { type: Boolean, default: false },
            pricingSection: { type: Boolean, default: false },
            faq: { type: Boolean, default: false }
        },
        // Products Page Components
        productsPage: {
            featuresStatsAlt: { type: Boolean, default: true },
            testimonialsSectionAlt: { type: Boolean, default: true }
        },
        // Services Page Components
        servicesPage: {
            featuresStats: { type: Boolean, default: true }
        }
    },

    updatedBy: { type: mongoose.Types.ObjectId, default: null, ref: 'User' }
}, { timestamps: true });

// Solo permitir un documento de configuración
settingsSchema.statics.getConfig = async function() {
    let config = await this.findOne();
    if (!config) {
        // Crear configuración por defecto si no existe
        config = await this.create({
            system: {
                language: 'es',
                timezone: 'America/Mexico_City'
            },
            landing: {
                homePage: {
                    clientsSection: false,
                    featuresGeneral: false,
                    featuresNavs: false,
                    testimonialsSection: false,
                    pricingSection: false,
                    faq: false
                },
                productsPage: {
                    featuresStatsAlt: true,
                    testimonialsSectionAlt: true
                },
                servicesPage: {
                    featuresStats: true
                }
            }
        });
    }
    return config;
};

const Settings = model('Settings', settingsSchema);

export default Settings;
