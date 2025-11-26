import { GoogleGenAI } from "@google/genai";
import { TattooRequest } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTattooDesign = async (request: TattooRequest): Promise<string> => {
  try {
    const preferencesString = request.preferences.join(', ');
    
    // Clean base64 string if it has the data prefix
    const base64Image = request.image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    const prompt = `
      Act as a world-class minimalist tattoo artist.
      I will provide an image of a hand. Your task is to design a tattoo directly onto this hand image.
      
      CRITICAL INSTRUCTION: There are visible scars on the hand/wrist. The design MUST artfully cover, incorporate, or distract from these scars.
      
      Design Requirements:
      1. Style: Minimalist, geometric, fine-line, sophisticated.
      2. Themes to incorporate abstractly: ${preferencesString}.
      3. Placement: Specifically target the scarred area and flow naturally with the hand's anatomy.
      4. Aesthetics: Use black ink. Make it look like a realistic photo of a fresh tattoo.
      
      Do not output a white background. Return the original photo with the tattoo applied to the skin.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              data: base64Image,
              mimeType: 'image/jpeg',
            },
          },
        ],
      },
    });

    // Extract the generated image from the response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image was generated. Please try again.");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};