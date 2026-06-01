import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapMarkerAlt, FaSearch, FaCheckCircle } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";

export default function DestinationSearch({ placeQuery, setPlaceQuery, selectedPlace, selectPlace }) {
  const [suggestions, setSuggestions] = useState([]);
  const debounceTimer = useRef(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const dest = searchParams.get("destination");
    if (dest && !placeQuery && !selectedPlace) {
      fetchPlaces(dest);
    }
  }, []);

  const fetchPlaces = (query) => {
    setPlaceQuery(query);
    if (query.length < 3) {
      setSuggestions([]);
      clearTimeout(debounceTimer.current);
      return;
    }
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`
        );
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error(err);
      }
    }, 350);
  };

  const handleSelect = (place) => {
    selectPlace(place);
    setSuggestions([]);
  };

  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl p-5 border border-violet-100 dark:border-violet-900/50 shadow-sm relative">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
        <span className="w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center">
          <FaMapMarkerAlt className="text-violet-600 dark:text-violet-400 text-xs" />
        </span>
        Where do you want to go?
      </label>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-3 ml-9">Search any city, country or landmark</p>
      <div className="relative">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
        <input
          type="text"
          placeholder="Search city, country or landmark…"
          value={placeQuery}
          onChange={(e) => fetchPlaces(e.target.value)}
          className="w-full pl-11 pr-10 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 text-sm outline-none focus:border-violet-500 dark:focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:focus:ring-violet-900 transition-all duration-200 shadow-sm"
        />
        {selectedPlace && (
          <FaCheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 text-base" />
        )}
      </div>
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.ul initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="absolute bg-white dark:bg-gray-900 w-[calc(100%-2.5rem)] border border-gray-200 dark:border-gray-700 shadow-2xl rounded-xl mt-1 z-30 max-h-56 overflow-auto">
            {suggestions.map((item) => (
              <li key={item.place_id} onClick={() => handleSelect(item)}
                className="px-4 py-3 hover:bg-violet-50 dark:hover:bg-gray-800 cursor-pointer text-sm text-gray-700 dark:text-gray-200 flex items-center gap-3 border-b border-gray-50 dark:border-gray-800 last:border-0 transition-colors">
                <span className="w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt className="text-violet-500 dark:text-violet-400 text-xs" />
                </span>
                <span className="line-clamp-1">{item.display_name}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
