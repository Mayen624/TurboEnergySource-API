import settingsSchema from "#models/v1/settings.js";

/**
 * Get current settings configuration
 * Returns the single configuration document
 */
const getSettings = async (req, res) => {
    try {
        const settings = await settingsSchema.getConfig();

        return res.status(200).json({
            success: true,
            settings: settings
        });

    } catch (e) {
        console.error('[Settings] Error fetching settings:', e.message);
        return res.status(500).json({
            success: false,
            error: 'Error loading settings'
        });
    }
};

/**
 * Get public settings (no auth required)
 * Returns only landing visibility configuration for frontend
 */
const getPublicSettings = async (req, res) => {
    try {
        const settings = await settingsSchema.getConfig();

        // Only return landing visibility and system language
        return res.status(200).json({
            success: true,
            settings: {
                language: settings.system.language,
                landing: settings.landing
            }
        });

    } catch (e) {
        console.error('[Settings] Error fetching public settings:', e.message);
        return res.status(500).json({
            success: false,
            error: 'Error loading settings'
        });
    }
};

/**
 * Update settings configuration
 * Updates system or landing configuration
 */
const updateSettings = async (req, res) => {
    try {
        const { system, landing } = req.body;

        if (!system && !landing) {
            return res.status(400).json({
                success: false,
                error: 'Please provide system or landing configuration to update'
            });
        }

        // Get current settings
        let settings = await settingsSchema.getConfig();

        // Prepare update data
        const updateData = {
            updatedBy: req.user.userId
        };

        // Update system configuration if provided
        if (system) {
            updateData.system = {
                ...settings.system,
                ...system
            };
        }

        // Update landing configuration if provided
        if (landing) {
            updateData.landing = {
                homePage: {
                    ...settings.landing.homePage,
                    ...(landing.homePage || {})
                },
                productsPage: {
                    ...settings.landing.productsPage,
                    ...(landing.productsPage || {})
                },
                servicesPage: {
                    ...settings.landing.servicesPage,
                    ...(landing.servicesPage || {})
                }
            };
        }

        // Update settings
        settings = await settingsSchema.findByIdAndUpdate(
            settings._id,
            updateData,
            { new: true }
        );

        if (!settings) {
            return res.status(404).json({
                success: false,
                error: 'Settings could not be updated'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Settings updated successfully',
            settings: settings
        });

    } catch (e) {
        console.error('[Settings] Error updating settings:', e.message);
        return res.status(500).json({
            success: false,
            error: 'Error updating settings: ' + e.message
        });
    }
};

const settingsController = {
    getSettings,
    getPublicSettings,
    updateSettings
};

export default settingsController;
