/* eslint-env node */
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { location, traveler, budget } = req.body;
    
    if (!location || !traveler || !budget) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const genAI = new GoogleGenerativeAI(process.env.VITE_GOOGLE_GEMINI_AI_API_KEY || process.env.GOOGLE_GEMINI_AI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: "You are an expert travel planner. Always respond with valid JSON only — no markdown, no commentary, no text before or after the JSON object."
    });

    const prompt = `Generate a JSON array of 4 hotels for Location: ${location}, Traveler: ${traveler}, Budget: ${budget}. Always quote all prices in the official local currency of ${location}. Output ONLY a JSON array, no markdown. Schema: [{"hotelName": "", "hotelAddress": "", "price": "", "geoCoordinates": {"latitude": 0, "longitude": 0}, "rating": 0, "description": ""}]`;

    const result = await model.generateContent(prompt);
    let text = await result.response.text();
    text = text.replace(/```json|```/g, "").trim();
    
    res.status(200).json({ data: JSON.parse(text) });
  } catch (error) {
    console.error('Error regenerating hotels:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
