import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const chatSession = model.startChat({
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
                hotelName: "Circus Circus Hotel, Casino & Theme Park",
                hotelAddress: "2880 S Las Vegas Blvd, Las Vegas, NV 89109",
                price: "$40 - $80 per night",
                hotelImageUrl: "",
                geoCoordinates: { latitude: 36.1267, longitude: -115.1664 },
                rating: 3.5,
                description: "Classic Vegas hotel with circus theme and free circus acts.",
              },
              {
                hotelName: "Excalibur Hotel & Casino",
                hotelAddress: "3850 S Las Vegas Blvd, Las Vegas, NV 89109",
                price: "$50 - $90 per night",
                hotelImageUrl: "",
                geoCoordinates: { latitude: 36.0957, longitude: -115.1742 },
                rating: 4.0,
                description: "Medieval-themed hotel on the south Strip with affordable dining.",
              },
            ],
            itinerary: {
              day1: {
                theme: "South Strip Exploration",
                activities: [
                  {
                    placeName: "Welcome to Las Vegas Sign",
                    placeDetails: "Iconic photo opportunity.",
                    placeImageUrl: "",
                    geoCoordinates: { latitude: 36.0827, longitude: -115.1726 },
                    ticketPricing: "Free",
                    timeTravel: "30 minutes",
                    bestTimeToVisit: "Early morning",
                  },
                  {
                    placeName: "Bellagio Fountains",
                    placeDetails: "Spectacular free fountain show set to music.",
                    placeImageUrl: "",
                    geoCoordinates: { latitude: 36.1126, longitude: -115.1742 },
                    ticketPricing: "Free",
                    timeTravel: "Adjacent to Conservatory",
                    bestTimeToVisit: "Evening",
                  },
                ],
              },
              day2: {
                theme: "Downtown Las Vegas (Fremont Street)",
                activities: [
                  {
                    placeName: "Fremont Street Experience",
                    placeDetails: "Pedestrian mall with massive Viva Vision screen and free concerts.",
                    placeImageUrl: "",
                    geoCoordinates: { latitude: 36.17, longitude: -115.1421 },
                    ticketPricing: "Free",
                    timeTravel: "30-45 minutes from Strip",
                    bestTimeToVisit: "Evening",
                  },
                ],
              },
              day3: {
                theme: "LINQ Promenade & Views",
                activities: [
                  {
                    placeName: "High Roller Observation Wheel",
                    placeDetails: "Giant Ferris wheel with stunning Strip views.",
                    placeImageUrl: "",
                    geoCoordinates: { latitude: 36.117, longitude: -115.1705 },
                    ticketPricing: "$25 - $35 per person",
                    timeTravel: "Located on LINQ Promenade",
                    bestTimeToVisit: "Sunset",
                  },
                ],
              },
            },
          }),
        },
      ],
    },
  ],
});

export const regenerateHotels = async (location, traveler, budget) => {
  try {
    const prompt = `Generate a JSON array of 4 hotels for Location: ${location}, Traveler: ${traveler}, Budget: ${budget}. Always quote all prices in the official local currency of ${location}. Output ONLY a JSON array, no markdown. Schema: [{"hotelName": "", "hotelAddress": "", "price": "", "geoCoordinates": {"latitude": 0, "longitude": 0}, "rating": 0, "description": ""}]`;
    const result = await model.generateContent(prompt);
    let text = await result.response.text();
    text = text.replace(/```json|```/g, "").trim();
    return JSON.parse(text);
  } catch (error) {
    throw new Error("Failed to regenerate hotels: " + error.message);
  }
};

export const regenerateDay = async (location, dayNumber, totalDays, traveler, budget) => {
  try {
    const prompt = `Generate a single day itinerary (Day ${dayNumber} of ${totalDays}) for Location: ${location}, Traveler: ${traveler}, Budget: ${budget}. Always quote all prices in the official local currency of ${location}. Output ONLY a JSON object, no markdown. Schema: {"theme": "", "activities": [{"placeName": "", "placeDetails": "", "ticketPricing": "", "timeTravel": "", "geoCoordinates": {"latitude": 0, "longitude": 0}}]}`;
    const result = await model.generateContent(prompt);
    let text = await result.response.text();
    text = text.replace(/```json|```/g, "").trim();
    return JSON.parse(text);
  } catch (error) {
    throw new Error("Failed to regenerate day: " + error.message);
  }
};
