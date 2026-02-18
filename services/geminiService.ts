
import { GoogleGenAI, Type } from "@google/genai";
import { Recipe } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const geminiService = {
  async parseRecipe(text: string): Promise<Partial<Recipe>> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Parse this recipe text into a JSON object with: title, description, servings (number), ingredients (array of {name, amount, unit}), and steps (array of strings). Use French. Text: ${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            servings: { type: Type.NUMBER },
            ingredients: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  amount: { type: Type.NUMBER },
                  unit: { type: Type.STRING }
                },
                required: ["name", "amount", "unit"]
              }
            },
            steps: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    try {
      return JSON.parse(response.text);
    } catch (e) {
      console.error("Failed to parse Gemini response", e);
      return {};
    }
  },

  async generateRecipeImage(prompt: string): Promise<string | undefined> {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: `High quality, appetizing food photography of: ${prompt}. Professional lighting, top-down view.` }
        ]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return undefined;
  },

  async suggestRecipes(pantryItems: string[]): Promise<string[]> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `J'ai ces ingrédients dans ma cuisine : ${pantryItems.join(', ')}. Suggère moi 3 noms de recettes françaises simples à faire.`,
    });
    return response.text.split('\n').filter(line => line.trim().length > 0);
  }
};
