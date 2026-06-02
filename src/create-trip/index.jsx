import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { auth, db } from "@/service/firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, collection, setDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { FaCheckCircle } from "react-icons/fa";
import { MdFlightTakeoff } from "react-icons/md";
import { HiSparkles } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AI_PROMPT } from "../constants/options";
import { getPlaceImage } from "@/service/GlobalApi";
import { motion, AnimatePresence } from "framer-motion";

// Components
import DestinationSearch from "./components/DestinationSearch";
import DurationSelector from "./components/DurationSelector";
import TravelGroupSelector from "./components/TravelGroupSelector";
import BudgetSelector from "./components/BudgetSelector";

const COLLAGE = [
  "https://images.pexels.com/photos/1537640/pexels-photo-1537640.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?auto=compress&cs=tinysrgb&w=800",
];

function CreateTrip() {
  const [placeQuery, setPlaceQuery]             = useState("");
  const [selectedPlace, setSelectedPlace]       = useState(null);
  const [selectedTraveler, setSelectedTraveler] = useState("");
  const [selectedBudget, setSelectedBudget]     = useState("");
  const [tripDays, setTripDays]                 = useState(1);
  const [formData, setFormData]                 = useState({});
  const [openDialog, setOpenDialog]             = useState(false);
  const [loading, setLoading]                   = useState(false);
  const [previewImg, setPreviewImg]             = useState("");
  const [collageIdx, setCollageIdx]             = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedPlace) return;
    const t = setInterval(() => setCollageIdx((i) => (i + 1) % COLLAGE.length), 4000);
    return () => clearInterval(t);
  }, [selectedPlace]);

  useEffect(() => {
    if (!selectedPlace) return;
    getPlaceImage(selectedPlace.display_name).then((url) => setPreviewImg(url));
  }, [selectedPlace]);

  const handleInputChange = (name, value) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  const selectPlace = (place) => {
    setSelectedPlace(place);
    setPlaceQuery(place.display_name);
    handleInputChange("location", { label: place.display_name });
  };

  const adjustDays = (delta) => {
    const next = Math.max(1, Math.min(30, tripDays + delta));
    setTripDays(next);
    handleInputChange("noOfDays", next);
  };

  const login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setOpenDialog(false);
      OnGenerateTrip();
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign in.");
    }
  };

  const OnGenerateTrip = async () => {
    const user = auth.currentUser;
    if (!user) { setOpenDialog(true); return; }
    if (!formData?.location || !formData?.budget || !formData?.traveler || !formData?.noOfDays || formData?.noOfDays <= 0) {
      toast.error("Please fill in all details."); return;
    }
    setLoading(true);
    try {
      let budgetConstraint = "";
      if (formData?.budget === "Low") budgetConstraint = "with a cheap/budget-friendly budget";
      else if (formData?.budget === "Moderate") budgetConstraint = "with a moderate/mid-range budget";
      else if (formData?.budget === "Luxury") budgetConstraint = "with a luxury/high-end budget";
      else if (formData?.budget === "Custom") {
        const perDayBudget = Math.round(Number(formData?.customBudget) / Number(formData?.noOfDays));
        budgetConstraint = `with a budget of approximately $${perDayBudget} per day`;
      }

      const FINAL_PROMPT = AI_PROMPT
        .replace("{location}",   formData?.location?.label)
        .replace(/{totalDays}/g, formData?.noOfDays)
        .replace("{traveler}",   formData?.traveler)
        .replace("{budgetConstraint}", budgetConstraint);
      
      const response = await fetch('/api/generate-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: FINAL_PROMPT })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch from backend API');
      }

      const { data } = await response.json();
      console.log('✅ AI Response:', data);
      await SaveAiTrip(data);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while generating your trip. Make sure the API is running.");
    } finally { setLoading(false); }
  };

  const SaveAiTrip = async (TripData) => {
    try {
      // Extract the outermost JSON object
      const match = TripData.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("No JSON object found in AI response");
      const parsedData = JSON.parse(match[0]);
      
      const user = auth.currentUser;
      const tripRef = doc(collection(db, "AITrips")); // Generate UUID automatically
      
      await setDoc(tripRef, {
        userSelection: formData,
        tripData:      parsedData,
        userEmail:     user?.email,
        id:            tripRef.id,
      });
      console.log('🔥 Saved to Firestore — Doc ID:', tripRef.id);
      navigate("/view-trip/" + tripRef.id);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save trip data.");
    }
  };

  const isFormComplete =
    formData?.location && formData?.noOfDays > 0 && formData?.traveler && formData?.budget &&
    (formData?.budget !== "Custom" || (formData?.budget === "Custom" && formData?.customBudget));

  const checklist = [
    { label: "Destination",  done: !!formData?.location },
    { label: "Duration",     done: !!formData?.noOfDays },
    { label: "Travel group", done: !!formData?.traveler },
    { label: "Budget",       done: !!formData?.budget },
  ];

  const completedCount = checklist.filter((c) => c.done).length;
  const rightBg = selectedPlace && previewImg ? previewImg : COLLAGE[collageIdx];

  return (
    <div className="min-h-screen bg-[#f8f7ff] dark:bg-gray-950 transition-colors duration-300">

      {/* Loading overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center gap-6">
            <motion.div animate={{ y: [0, -18, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}>
              <MdFlightTakeoff className="text-6xl text-violet-400" />
            </motion.div>
            <div className="text-center">
              <p className="text-white text-2xl font-bold mb-1">Building your itinerary ✨</p>
              <p className="text-white/50 text-sm">AI is crafting the perfect plan for you…</p>
            </div>
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((i) => (
                <motion.span key={i} className="w-2 h-2 bg-violet-400 rounded-full block"
                  animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex min-h-screen">

        {/* ── LEFT — Form ── */}
        <div className="w-full lg:w-[58%] overflow-y-auto bg-gradient-to-br from-[#f5f3ff] via-[#eff6ff] to-[#f0fdf4] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">

          {/* Header */}
          <div className="px-6 sm:px-10 xl:px-14 pt-10 pb-6 border-b border-violet-100 dark:border-violet-900">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 bg-violet-100 dark:bg-violet-950/40 dark:text-violet-400 px-3 py-1 rounded-full mb-3">
                <HiSparkles /> AI-Powered Trip Planner
              </span>
              <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
                Let's start your journey ✈️
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-base">Tell us your vibe — we'll handle the rest.</p>

              {/* Progress bar */}
              <div className="mt-5">
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                  <span>Step {completedCount} of 4</span>
                  <span>{Math.round((completedCount / 4) * 100)}% complete</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full"
                    animate={{ width: `${(completedCount / 4) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="px-6 sm:px-10 xl:px-14 py-8 space-y-8">

            <DestinationSearch 
              placeQuery={placeQuery}
              setPlaceQuery={setPlaceQuery}
              selectedPlace={selectedPlace}
              selectPlace={selectPlace}
            />

            <DurationSelector 
              tripDays={tripDays}
              adjustDays={adjustDays}
              setTripDays={setTripDays}
              handleInputChange={handleInputChange}
            />

            <TravelGroupSelector 
              selectedTraveler={selectedTraveler}
              setSelectedTraveler={setSelectedTraveler}
              handleInputChange={handleInputChange}
            />

            <BudgetSelector 
              selectedBudget={selectedBudget}
              setSelectedBudget={setSelectedBudget}
              handleInputChange={handleInputChange}
            />

            {/* CTA */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="pb-10">
              <motion.button
                whileHover={isFormComplete ? { scale: 1.02, boxShadow: "0 0 30px rgba(124,58,237,0.4)" } : {}}
                whileTap={isFormComplete ? { scale: 0.98 } : {}}
                disabled={loading || !isFormComplete}
                onClick={OnGenerateTrip}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300 ${
                  isFormComplete
                    ? "bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 text-white cursor-pointer shadow-xl shadow-violet-200 dark:shadow-none"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                }`}>
                {loading
                  ? <><AiOutlineLoading3Quarters className="animate-spin text-lg" /> Generating…</>
                  : <><HiSparkles className="text-lg" /> Generate My Trip ✨</>
                }
              </motion.button>
              {!isFormComplete && (
                <p className="text-xs text-gray-400 mt-2">Complete all fields above to unlock.</p>
              )}
            </motion.div>

          </div>
        </div>

        {/* ── RIGHT — Visual panel ── */}
        <div className="hidden lg:flex lg:w-[42%] sticky top-0 h-screen flex-col overflow-hidden">
          <div className="relative flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={rightBg}
                src={rightBg}
                onError={(e) => { e.target.src = "/placeholder.jpg"; }}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 w-full h-full object-cover"
                alt="destination"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/20 to-transparent" />

            <div className="absolute top-6 left-6">
              <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                {selectedPlace ? "Destination Preview" : "Explore the World"}
              </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-7">
              {selectedPlace ? (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                  <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Your destination</p>
                  <h2 className="text-white text-2xl font-extrabold leading-tight mb-3">
                    {selectedPlace.display_name.split(",").slice(0, 2).join(",")}
                  </h2>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {checklist.map((c, i) => (
                      <div key={i} className={`flex items-center gap-2 text-xs font-medium transition-all ${c.done ? "text-white" : "text-white/30"}`}>
                        <FaCheckCircle className={`text-sm flex-shrink-0 transition-colors ${c.done ? "text-emerald-400" : "text-white/20"}`} />
                        {c.label}
                      </div>
                    ))}
                  </div>
                  {isFormComplete && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-2">
                      {[
                        `📍 ${formData?.location?.label?.split(",")[0]}`,
                        `📅 ${formData?.noOfDays} days`,
                        `👥 ${formData?.traveler}`,
                        `💰 ${formData?.budget === "Custom" ? `$${formData?.customBudget}` : formData?.budget}`,
                      ].map((tag, i) => (
                        <span key={i} className="text-xs bg-white/15 backdrop-blur-sm border border-white/20 text-white px-3 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Start exploring</p>
                  <h2 className="text-white text-2xl font-extrabold mb-1">The world is waiting</h2>
                  <p className="text-white/60 text-sm">Search a destination to see your preview</p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Bottom strip */}
          <div className="bg-slate-900 px-7 py-4 flex items-center justify-between gap-4">
            {[
              { icon: "⚡", label: "AI-generated in seconds" },
              { icon: "🏙️", label: "Real place recommendations" },
              { icon: "📅", label: "Day-by-day itinerary" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-base">{s.icon}</span>
                <p className="text-white/60 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sign-in dialog */}
      <Dialog open={openDialog}>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogDescription asChild>
              <div className="text-center py-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center mx-auto mb-4">
                  <MdFlightTakeoff className="text-white text-2xl" />
                </div>
                <h2 className="font-extrabold text-xl text-gray-900 dark:text-white mb-1">Sign in to continue</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">We'll save your trip to your account</p>
                <button onClick={login}
                  className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 transition-all">
                  <FcGoogle className="text-xl" /> Continue with Google
                </button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;
