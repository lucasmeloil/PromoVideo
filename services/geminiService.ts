
import { GoogleGenAI } from "@google/genai";

// This function can take several minutes to complete.
export const generateVideo = async (prompt: string, imageBase64: string): Promise<string | null> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
    }
    
    // Create a new instance right before the call to use the latest key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const fullPrompt = `Crie um vídeo de propaganda animado com duração de 15 a 30 segundos baseado no seguinte: "${prompt}". O vídeo deve incorporar o logotipo/mascote fornecido com animações dinâmicas como entrada, brilho e movimento. Inclua textos sobrepostos com slogans e chamadas para ação. O estilo deve ser vibrante e moderno.`;

    try {
        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: fullPrompt,
            image: {
                imageBytes: imageBase64,
                mimeType: 'image/png', // Assuming PNG, adjust if needed
            },
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '16:9'
            }
        });

        // Poll for the result
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds between polls
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        if (operation.error) {
            throw new Error(`Video generation failed: ${operation.error.message}`);
        }

        const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;

        if (!videoUri) {
            throw new Error("No video URI found in the operation response.");
        }
        
        return videoUri;

    } catch (error) {
        console.error("Error in generateVideo service:", error);
        throw error;
    }
};
