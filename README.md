# ✈️ GeoBuzz — AI-Powered Smart Trip Planner

GeoBuzz is a full-stack travel planning web app that uses **Google Gemini AI** to generate personalized trip itineraries in seconds. Tell it where you want to go, how long you're staying, your travel group, and your budget — GeoBuzz handles the rest.

---

## ✨ Features

- **AI Trip Generation** — Powered by Gemini 2.5 Flash, GeoBuzz creates a complete itinerary with hotel recommendations and day-by-day activities, tailored to your budget and travel style.
- **Smart Hotel Picks** — Curated hotel options with ratings, pricing, addresses, and geo-coordinates.
- **Day-by-Day Itinerary** — Each day includes places to visit, ticket pricing, travel time, and best time to visit.
- **Regenerate on Demand** — Individually regenerate hotel recommendations or any specific day's plan with one click.
- **Google Places Autocomplete** — Search destinations with real-time suggestions via the Google Places API.
- **Dynamic Place Images** — Images are fetched automatically from Pexels and Wikipedia, with a local placeholder fallback.
- **Google OAuth Authentication** — Sign in with your Google account to save and manage your trips.
- **Cloud Trip Storage** — Trips are saved to Firebase Firestore and accessible anytime.
- **My Trips Dashboard** — Browse and revisit all previously generated trips.
- **Dark Mode** — Full light/dark theme support via a React context.
- **Responsive Design** — Mobile-first UI built with Tailwind CSS and Framer Motion animations.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 6 |
| Styling | Tailwind CSS 4, Framer Motion, GSAP |
| UI Components | Radix UI, shadcn/ui, Lucide React |
| AI | Google Gemini 2.5 Flash (`@google/generative-ai`) |
| Maps & Places | Google Places API (New) |
| Images | Pexels API, Wikipedia API |
| Auth | Google OAuth (`@react-oauth/google`, Firebase Auth) |
| Database | Firebase Firestore |
| Routing | React Router DOM v7 |
| Deployment | Vercel |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── custom/
│   │   ├── Header.jsx          # Navigation bar with auth
│   │   ├── Hero.jsx            # Landing page with features & steps
│   │   └── Image.jsx           # Lazy image component with fallback
│   ├── ui/                     # shadcn/ui base components
│   └── GlobalBackground.jsx    # Animated background layer
├── context/
│   └── DarkModeContext.jsx     # Dark mode state provider
├── create-trip/
│   ├── index.jsx               # Trip creation wizard (main form)
│   └── components/
│       ├── DestinationSearch.jsx
│       ├── DurationSelector.jsx
│       ├── TravelGroupSelector.jsx
│       └── BudgetSelector.jsx
├── view-trip/
│   ├── [tripid]/index.jsx      # Trip detail page
│   └── components/
│       ├── InfoSection.jsx     # Trip overview banner
│       ├── Hotels.jsx          # Hotel cards grid
│       ├── HotelCardItem.jsx
│       ├── PlacesToVisit.jsx   # Day-by-day itinerary
│       ├── PlaceCardItem.jsx
│       └── Footer.jsx
├── my-trips/
│   ├── index.jsx               # User's saved trips list
│   └── components/
│       └── UserTripCardItem.jsx
├── service/
│   ├── AIModal.jsx             # Gemini AI client & prompts
│   ├── GlobalApi.jsx           # Google Places & image APIs
│   └── firebaseConfig.jsx      # Firebase initialization
├── constants/
│   └── options.jsx             # Budget/group options & AI prompt template
├── pages/
│   └── NotFound.jsx
├── App.jsx
└── main.jsx                    # Router & app bootstrap
api/
└── generate-trip.js            # Vercel serverless function (backend proxy)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Google Cloud project with the **Places API (New)** enabled
- A Google AI Studio account for a **Gemini API key**
- A **Pexels API** account
- A **Firebase** project with Firestore and Google Auth enabled

### 1. Clone the repository

```bash
git clone https://github.com/your-username/geo-buzz.git
cd geo-buzz
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root and add the following:

```env
VITE_GOOGLE_PLACE_API_KEY=your_google_places_api_key
VITE_GOOGLE_GEMINI_AI_API_KEY=your_gemini_api_key
VITE_PEXELS_API_KEY=your_pexels_api_key

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> ⚠️ **Never commit your `.env` file.** It is already included in `.gitignore`.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for production

```bash
npm run build
```

---

## 🌐 Live Demo

**[geobuzz.vercel.app](https://geobuzz.vercel.app)**

No setup needed — just open the link, sign in with Google, and start planning your trip.

---

## 🔑 API Keys Setup Guide

| Service | Where to get it |
|---|---|
| Google Places API | [Google Cloud Console](https://console.cloud.google.com/) → Enable "Places API (New)" |
| Google Gemini AI | [Google AI Studio](https://aistudio.google.com/) → Create API Key |
| Pexels | [Pexels API](https://www.pexels.com/api/) → Create a free account |
| Firebase | [Firebase Console](https://console.firebase.google.com/) → Create project → Enable Firestore & Google Auth |

---

## 📖 How It Works

1. **Enter your destination** using the Google Places Autocomplete search.
2. **Set your preferences** — number of days (1–10), travel group (solo, couple, family, friends), and budget (cheap, moderate, luxury).
3. **Sign in with Google** to save your trip (required before generating).
4. **GeoBuzz generates your plan** — Gemini AI returns a structured JSON response with hotels and a full day-by-day itinerary.
5. **View your trip** — Browse hotels on cards with ratings and pricing. Explore each day's activities with place images, ticket costs, and travel times.
6. **Regenerate anything** — Not happy with the hotels or a specific day? Regenerate with one click.
7. **Access your trips anytime** — All trips are saved to Firestore and visible under "My Trips."

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).
