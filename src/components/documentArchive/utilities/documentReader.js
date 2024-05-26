import { fileURLToPath } from 'url';
import { dirname } from 'path';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

import { DocumentAnalysisClient, AzureKeyCredential } from '@azure/ai-form-recognizer';

const endpoint = process.env.VITE_AZURE_FORM_RECOGNIZER_ENDPOINT;
const apiKey = process.env.VITE_AZURE_FORM_RECOGNIZER_KEY;

if (!endpoint || !apiKey) {
    console.error("Azure Form Recognizer endpoint or key is not defined.");
    process.exit(1);
}

const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(apiKey));

const analyzeDocument = async (sasUrl) => {
    try {
        const poller = await client.beginAnalyzeDocumentFromUrl(
            "prebuilt-invoice",
            sasUrl
        );

        const { documents } = await poller.pollUntilDone();
        return documents;
    } catch (error) {
        console.error("Error during document analysis:", error);
        throw error;
    }
};

export default analyzeDocument;