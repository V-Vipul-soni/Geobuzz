import { FaHotel } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import HotelCardItem from "./HotelCardItem";
import { regenerateHotels } from "@/service/AIModal";

function Hotels({ trip, editMode, onRemoveHotel, onRegenerateHotels, userSelection }) {
  const hotels = trip?.tripData?.hotels;
  const [loading, setLoading] = useState(false);

  if (!hotels?.length && !editMode) return null;

  const handleRegenerate = async () => {
    if (!userSelection) return;
    setLoading(true);
    try {
      const newHotels = await regenerateHotels(
        userSelection.location.label,
        userSelection.traveler,
        userSelection.budget
      );
      onRegenerateHotels(newHotels);
      toast.success("Hotels regenerated successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
      className="mb-10">

      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
            <FaHotel className="text-white text-sm" />
          </div>
          <div>
            <h2 className="font-extrabold text-xl text-gray-900 dark:text-white">Hotel Recommendations</h2>
            <p className="text-gray-400 dark:text-gray-500 text-sm">{hotels?.length || 0} options curated for you</p>
          </div>
        </div>
        
        {editMode && (
          <button onClick={handleRegenerate} disabled={loading} className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-900 border border-blue-200 dark:border-blue-700 rounded-lg shadow-sm hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors disabled:opacity-50">
            {loading ? <AiOutlineLoading3Quarters className="animate-spin" /> : <FiRefreshCw />}
            Regenerate All
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {hotels?.map((hotel, i) => (
          <HotelCardItem key={i} hotel={hotel} editMode={editMode} onRemove={() => onRemoveHotel(i)} />
        ))}
      </div>
    </motion.div>
  );
}

export default Hotels;
