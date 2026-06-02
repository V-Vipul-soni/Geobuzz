export const SelectTravelesList = [
  { id: 1, title: "Just Me",   desc: "A sole traveler in exploration",    icon: "🚶‍♂️", people: "1" },
  { id: 2, title: "A Couple",  desc: "Two travelers in tandem",           icon: "🧑‍🤝‍🧑", people: "2 people" },
  { id: 3, title: "Family",    desc: "A group of fun loving adventurers", icon: "👨‍👩‍👧‍👦", people: "3 to 5 people" },
  { id: 4, title: "Friends",   desc: "A bunch of thrill-seekers",         icon: "👯", people: "5 to 10 People" },
];

export const SelectBudgetOptions = [
  { id: 1, title: "Low",      desc: "Budget-friendly, everyday prices",   icon: "💵" },
  { id: 2, title: "Moderate", desc: "Mid-range comfort",                  icon: "💰" },
  { id: 3, title: "Luxury",   desc: "High-end, premium experiences",      icon: "🤑" },
  { id: 4, title: "Custom",   desc: "Set an exact maximum budget",        icon: "✍️" },
];

export const AI_PROMPT =
  "Generate Travel Plan for Location: {location}, for {totalDays} Days, for {traveler} {budgetConstraint}. " +
  "Always quote all prices in the official local currency of {location}. " +
  "Give me a Hotels options list with HotelName, Hotel address, price, hotel image url, geo coordinates, rating, descriptions " +
  "and suggest itinerary with placeName, place Details, place image Url, Geo coordinates, ticket pricing, Time to travel " +
  "for each location for {totalDays} Days with each day plan with best time to visit in JSON format.";
