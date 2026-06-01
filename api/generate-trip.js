/* eslint-env node */
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    // Initialize Gemini AI securely on the server
    const genAI = new GoogleGenerativeAI(process.env.VITE_GOOGLE_GEMINI_AI_API_KEY || process.env.GOOGLE_GEMINI_AI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: "You are an expert travel planner. Always respond with valid JSON only — no markdown, no commentary, no text before or after the JSON object. Your response must be a single valid JSON object matching the schema requested. Use realistic prices, real geo coordinates, and practical travel advice."
    });

    const generationConfig = {
      temperature: 0.65,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    };

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              text:
                "Generate Travel Plan for Location: Las Vegas, for 3 Days, for Couple with a Cheap budget. " +
                "Give me a Hotels options list with HotelName, Hotel address, price, hotel image url, geo coordinates, rating, descriptions " +
                "and suggest itinerary with placeName, place Details, place image Url, Geo coordinates, ticket pricing, Time to travel " +
                "for each location for 3 Days with each day plan with best time to visit in JSON format.",
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: JSON.stringify({
                tripName: "Las Vegas Budget Getaway for Couples (3 Days)",
                location: "Las Vegas, Nevada",
                budget: "Cheap",
                travelers: "Couple",
                hotels: [
                  {
                    hotelName: "Circus Circus Hotel",
                    hotelAddress: "2880 S Las Vegas Blvd, Las Vegas, NV 89109",
                    price: "$40 - $80 per night",
                    hotelImageUrl: "",
                    geoCoordinates: { latitude: 36.1267, longitude: -115.1664 },
                    rating: 3.5,
                    description: "Classic Vegas hotel with circus theme.",
                  }
                ],
                itinerary: {
                  day1: {
                    theme: "Exploring the Strip",
                    activities: [
                      {
                        placeName: "Bellagio Fountains",
                        placeDetails: "Iconic water show.",
                        placeImageUrl: "",
                        geoCoordinates: { latitude: 36.1126, longitude: -115.1767 },
                        ticketPricing: "Free",
                        timeTravel: "1 hour"
                      }
                    ]
                  }
                }
              }),
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage(prompt);
    const responseText = await result.response.text();

    res.status(200).json({ data: responseText });
  } catch (error) {
    console.error('Error generating trip:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
