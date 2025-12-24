import aboutPageSchema from "#models/v1/aboutPage.js";

/**
 * Get about page content (protected)
 * Returns the full about page document for admin editing
 */
const getAboutPage = async (req, res) => {
    try {
        const pageContent = await aboutPageSchema.getPageContent();

        return res.status(200).json({
            success: true,
            data: pageContent
        });

    } catch (e) {
        console.error('[AboutPage] Error fetching about page:', e.message);
        return res.status(500).json({
            success: false,
            error: 'Error loading about page content'
        });
    }
};

/**
 * Get public about page content (no auth required)
 * Returns about page content for landing page display
 */
const getPublicAboutPage = async (req, res) => {
    try {
        const pageContent = await aboutPageSchema.getPageContent();

        // Return only the content fields, not metadata
        return res.status(200).json({
            success: true,
            data: {
                quienesSomos: pageContent.quienesSomos,
                misionVision: pageContent.misionVision,
                compromisos: pageContent.compromisos,
                politicaCalidad: pageContent.politicaCalidad,
                porQueElegirnos: pageContent.porQueElegirnos
            }
        });

    } catch (e) {
        console.error('[AboutPage] Error fetching public about page:', e.message);
        return res.status(500).json({
            success: false,
            error: 'Error loading about page content'
        });
    }
};

/**
 * Update about page content
 * Updates the single about page document
 */
const updateAboutPage = async (req, res) => {
    try {
        const { quienesSomos, misionVision, compromisos, politicaCalidad, porQueElegirnos } = req.body;

        // Get current page content
        let pageContent = await aboutPageSchema.getPageContent();

        // Prepare update data
        const updateData = {
            updatedBy: req.user.userId
        };

        // Update nested objects if provided
        if (quienesSomos) {
            updateData.quienesSomos = {
                title: quienesSomos.title ?? pageContent.quienesSomos.title,
                paragraph1: quienesSomos.paragraph1 ?? pageContent.quienesSomos.paragraph1,
                paragraph2: quienesSomos.paragraph2 ?? pageContent.quienesSomos.paragraph2,
                highlights: quienesSomos.highlights ?? pageContent.quienesSomos.highlights
            };
        }

        if (misionVision) {
            updateData.misionVision = {
                sectionTitle: misionVision.sectionTitle ?? pageContent.misionVision.sectionTitle,
                sectionSubtitle: misionVision.sectionSubtitle ?? pageContent.misionVision.sectionSubtitle,
                mision: misionVision.mision ? {
                    title: misionVision.mision.title ?? pageContent.misionVision.mision.title,
                    content: misionVision.mision.content ?? pageContent.misionVision.mision.content
                } : pageContent.misionVision.mision,
                vision: misionVision.vision ? {
                    title: misionVision.vision.title ?? pageContent.misionVision.vision.title,
                    content: misionVision.vision.content ?? pageContent.misionVision.vision.content
                } : pageContent.misionVision.vision
            };
        }

        if (compromisos) {
            updateData.compromisos = {
                sectionTitle: compromisos.sectionTitle ?? pageContent.compromisos.sectionTitle,
                sectionSubtitle: compromisos.sectionSubtitle ?? pageContent.compromisos.sectionSubtitle,
                items: compromisos.items ?? pageContent.compromisos.items
            };
        }

        if (politicaCalidad) {
            updateData.politicaCalidad = {
                badgeText: politicaCalidad.badgeText ?? pageContent.politicaCalidad.badgeText,
                title: politicaCalidad.title ?? pageContent.politicaCalidad.title,
                description: politicaCalidad.description ?? pageContent.politicaCalidad.description,
                points: politicaCalidad.points ?? pageContent.politicaCalidad.points,
                stats: politicaCalidad.stats ?? pageContent.politicaCalidad.stats
            };
        }

        if (porQueElegirnos) {
            updateData.porQueElegirnos = {
                sectionTitle: porQueElegirnos.sectionTitle ?? pageContent.porQueElegirnos.sectionTitle,
                sectionSubtitle: porQueElegirnos.sectionSubtitle ?? pageContent.porQueElegirnos.sectionSubtitle,
                reasons: porQueElegirnos.reasons ?? pageContent.porQueElegirnos.reasons
            };
        }

        // Update page content
        pageContent = await aboutPageSchema.findByIdAndUpdate(
            pageContent._id,
            updateData,
            { new: true }
        );

        if (!pageContent) {
            return res.status(404).json({
                success: false,
                error: 'About page content could not be updated'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'About page updated successfully',
            data: pageContent
        });

    } catch (e) {
        console.error('[AboutPage] Error updating about page:', e.message);
        return res.status(500).json({
            success: false,
            error: 'Error updating about page: ' + e.message
        });
    }
};

const aboutPageController = {
    getAboutPage,
    getPublicAboutPage,
    updateAboutPage
};

export default aboutPageController;
