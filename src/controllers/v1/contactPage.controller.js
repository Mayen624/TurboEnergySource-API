import contactPageSchema from "#models/v1/contactPage.js";

/**
 * Get contact page content (protected)
 * Returns the full contact page document for admin editing
 */
const getContactPage = async (req, res) => {
    try {
        const pageContent = await contactPageSchema.getPageContent();

        return res.status(200).json({
            success: true,
            data: pageContent
        });

    } catch (e) {
        console.error('[ContactPage] Error fetching contact page:', e.message);
        return res.status(500).json({
            success: false,
            error: 'Error loading contact page content'
        });
    }
};

/**
 * Get public contact page content (no auth required)
 * Returns contact page content for landing page display
 */
const getPublicContactPage = async (req, res) => {
    try {
        const pageContent = await contactPageSchema.getPageContent();

        // Return only the content fields, not metadata
        return res.status(200).json({
            success: true,
            data: {
                title: pageContent.title,
                subTitle: pageContent.subTitle,
                knowledgeBase: pageContent.knowledgeBase,
                faq: pageContent.faq,
                office: pageContent.office,
                email: pageContent.email
            }
        });

    } catch (e) {
        console.error('[ContactPage] Error fetching public contact page:', e.message);
        return res.status(500).json({
            success: false,
            error: 'Error loading contact page content'
        });
    }
};

/**
 * Update contact page content
 * Updates the single contact page document
 */
const updateContactPage = async (req, res) => {
    try {
        const { title, subTitle, knowledgeBase, faq, office, email } = req.body;

        // Get current page content
        let pageContent = await contactPageSchema.getPageContent();

        // Prepare update data
        const updateData = {
            updatedBy: req.user.userId
        };

        // Update fields if provided
        if (title !== undefined) updateData.title = title;
        if (subTitle !== undefined) updateData.subTitle = subTitle;

        // Update nested objects if provided
        if (knowledgeBase) {
            updateData.knowledgeBase = {
                ...pageContent.knowledgeBase.toObject(),
                ...knowledgeBase
            };
        }

        if (faq) {
            updateData.faq = {
                ...pageContent.faq.toObject(),
                ...faq
            };
        }

        if (office) {
            updateData.office = {
                ...pageContent.office.toObject(),
                ...office
            };
        }

        if (email) {
            updateData.email = {
                ...pageContent.email.toObject(),
                ...email
            };
        }

        // Update page content
        pageContent = await contactPageSchema.findByIdAndUpdate(
            pageContent._id,
            updateData,
            { new: true }
        );

        if (!pageContent) {
            return res.status(404).json({
                success: false,
                error: 'Contact page content could not be updated'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Contact page updated successfully',
            data: pageContent
        });

    } catch (e) {
        console.error('[ContactPage] Error updating contact page:', e.message);
        return res.status(500).json({
            success: false,
            error: 'Error updating contact page: ' + e.message
        });
    }
};

const contactPageController = {
    getContactPage,
    getPublicContactPage,
    updateContactPage
};

export default contactPageController;
