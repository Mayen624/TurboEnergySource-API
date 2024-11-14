import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise';
import validator from "#utils/v1/validator.js";

const CheckReCaptchaResponse = async (req, res, next) => {
    try {
        const {captchaResponse} = req.body;

        if (!validator.isNonEmptyString(captchaResponse)) {
            return res.status(401).json({ error: 'reCAPTCHA requerido.' });
        }

        const recaptchaAction = "submit_contact_form"; // Asegúrate de que coincide con el valor en el cliente

        // Función que crea y evalúa el token de reCAPTCHA.
        const score = await createAssessment({
            projectID : process.env.GOOGLE_PROJECT_ID,
            recaptchaKey : process.env.RE_CAPTCHA_PUBLIC_KEY,
            token: captchaResponse,
            recaptchaAction
        });

        if (score !== null && score >= 0.5) {
            // Si el resultado es aceptable
            next();
        } else {
            // Responde con un error si la validación de reCAPTCHA falla
            return res.status(403).json({ error: 'Fallo en la validación de reCAPTCHA.' });
        }

    } catch (e) {
        return res.status(500).json({ error: "Error en reCAPTCHA: " + e.message });
    }
}

// Función para crear la evaluación del token
async function createAssessment({ projectID, recaptchaKey, token, recaptchaAction }) {
    const client = new RecaptchaEnterpriseServiceClient();
    const projectPath = client.projectPath(projectID);

    const request = {
        assessment: {
            event: {
                token,
                siteKey: recaptchaKey,
            },
        },
        parent: projectPath,
    };

    const [response] = await client.createAssessment(request);

    // Verifica si el token es válido.
    if (!response.tokenProperties.valid) {
        throw new Error(`reCAPTCHA invalido: ${response.tokenProperties.invalidReason}`);
    }

    // Verifica si la acción del token coincide con la acción esperada.
    if (response.tokenProperties.action !== recaptchaAction) {
        throw new Error("La acción en el token no coincide con la acción esperada.");
    }

    console.log(`La puntuación de reCAPTCHA es: ${response.riskAnalysis.score}`);
    response.riskAnalysis.reasons.forEach((reason) => console.log(reason));

    return response.riskAnalysis.score;
}

export { CheckReCaptchaResponse };
