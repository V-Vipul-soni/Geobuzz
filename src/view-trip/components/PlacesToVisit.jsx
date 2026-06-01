import { useState } from "react";
import { MdExplore } from "react-icons/md";
import { FiRefreshCw } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import PlaceCardItem from "./PlaceCardItem";
import { regenerateDay } from "@/service/AIModal";

function PlacesToVisit({ trip, editMode, onRemovePlace, onUpdatePlace, onReorderPlaces, onRegenerateDay, userSelection }) {
  const itinerary = trip?.tripData?.itinerary;
  const [activeDay, setActiveDay] = useState(null);
  const [loadingDay, setLoadingDay] = useState(null);

  if (!itinerary || typeof itinerary !== "object") return null;

  const itineraryArray = Object.entries(itinerary).sort(
    (a, b) => parseInt(a[0].replace("day", "")) - parseInt(b[0].replace("day", ""))
  );

  const selectedDay = activeDay ?? itineraryArray[0]?.[0];

  const handleRegenerateDay = async (dayKey, dayNumber) => {
    if (!userSelection) return;
    setLoadingDay(dayKey);
    try {
      const newDayData = await regenerateDay(
        userSelection.location.label,
        dayNumber,
        itineraryArray.length,
        userSelection.traveler,
        userSelection.budget
      );
      onRegenerateDay(dayKey, newDayData);
      toast.success(`Day ${dayNumber} regenerated!`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingDay(null);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.replace("place-", ""));
      const newIndex = parseInt(over.id.replace("place-", ""));
      onReorderPlaces(selectedDay, oldIndex, newIndex);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
      className="mb-10">

      {/* Section header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
          <MdExplore className="text-white text-lg" />
        </div>
        <div>
          <h2 className="font-extrabold text-xl text-gray-900 dark:text-white">Day-by-Day Itinerary</h2>
          <p className="text-gray-400 dark:text-gray-500 text-sm">{itineraryArray.length} days planned</p>
        </div>
      </div>

      {/* Day tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {itineraryArray.map(([dayKey, dayValue]) => (
          <button key={dayKey} onClick={() => setActiveDay(dayKey)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              selectedDay === dayKey
                ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-md shadow-violet-200"
                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-violet-300 dark:hover:border-violet-500 hover:text-violet-600 dark:hover:text-violet-400"
            }`}>
            {dayKey.replace("day", "Day ")}
            {dayValue?.theme && (
              <span className="hidden sm:inline text-xs opacity-70 ml-1">
                · {dayValue.theme?.split(" ").slice(0, 2).join(" ")}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Active day content */}
      {itineraryArray.map(([dayKey, dayValue]) => {
        const dayNumber = parseInt(dayKey.replace("day", ""));
        return selectedDay === dayKey ? (
          <motion.div key={dayKey} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
            
            <div className="flex items-center justify-between mb-4 px-4 py-3 bg-gradient-to-r from-violet-50 dark:from-violet-950/40 to-blue-50 dark:to-blue-950/40 rounded-2xl border border-violet-100 dark:border-violet-800">
              {dayValue?.theme && (
                <p className="text-violet-700 dark:text-violet-300 font-semibold text-sm">🎯 {dayValue.theme}</p>
              )}
              {editMode && (
                <button
                  onClick={() => handleRegenerateDay(dayKey, dayNumber)}
                  disabled={loadingDay === dayKey}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400 bg-white dark:bg-gray-900 border border-violet-200 dark:border-violet-700 rounded-lg shadow-sm hover:bg-violet-50 dark:hover:bg-violet-950/40 transition-colors disabled:opacity-50"
                >
                  {loadingDay === dayKey ? <AiOutlineLoading3Quarters className="animate-spin" /> : <FiRefreshCw />}
                  Regenerate Day
                </button>
              )}
            </div>

            {editMode ? (
              <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={dayValue.activities?.map((_, i) => `place-${i}`) || []} strategy={verticalListSortingStrategy}>
                  <div className="grid md:grid-cols-2 gap-4">
                    {dayValue.activities?.map((place, idx) => (
                      <div key={`place-${idx}`}>
                        {place.timeTravel && (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 bg-violet-400 rounded-full" />
                            <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wide">{place.timeTravel}</span>
                          </div>
                        )}
                        <PlaceCardItem 
                          place={place} 
                          editMode={editMode} 
                          sortableId={`place-${idx}`}
                          onRemove={() => onRemovePlace(dayKey, idx)}
                          onUpdate={(field, val) => onUpdatePlace(dayKey, idx, field, val)}
                        />
                      </div>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {dayValue.activities?.map((place, idx) => (
                  <div key={idx}>
                    {place.timeTravel && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 bg-violet-400 rounded-full" />
                        <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wide">{place.timeTravel}</span>
                      </div>
                    )}
                    <PlaceCardItem place={place} />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : null;
      })}
    </motion.div>
  );
}

export default PlacesToVisit;
