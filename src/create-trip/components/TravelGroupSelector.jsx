import { motion } from "framer-motion";
import { FaUsers, FaCheckCircle } from "react-icons/fa";
import { SelectTravelesList } from "../../constants/options";

export default function TravelGroupSelector({ selectedTraveler, setSelectedTraveler, handleInputChange }) {
  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl p-5 border border-pink-100 dark:border-pink-900/50 shadow-sm">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
        <span className="w-7 h-7 rounded-lg bg-pink-100 dark:bg-pink-950/40 flex items-center justify-center">
          <FaUsers className="text-pink-600 dark:text-pink-400 text-xs" />
        </span>
        Pick your travel style
      </label>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-4 ml-9">Who are you exploring with?</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {SelectTravelesList.map((item) => (
          <motion.button key={item.id} whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}
            onClick={() => { setSelectedTraveler(item.people); handleInputChange("traveler", item.people); }}
            className={`relative p-4 rounded-2xl text-left transition-all duration-200 border-2 overflow-hidden ${
              selectedTraveler === item.people
                ? "border-violet-500 bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-950/20 dark:to-blue-950/20 shadow-lg shadow-violet-100 dark:shadow-none"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-violet-300 dark:hover:border-violet-500 hover:shadow-md"
            }`}>
            {selectedTraveler === item.people && (
              <span className="absolute top-2 right-2 w-4 h-4 bg-violet-600 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-white text-[8px]" />
              </span>
            )}
            <span className="text-3xl block mb-2">{item.icon}</span>
            <span className="font-bold text-gray-800 dark:text-gray-200 text-sm block">{item.title}</span>
            <span className="text-gray-400 dark:text-gray-500 text-xs leading-tight">{item.desc}</span>
          </motion.button>
        ))}
      </div>
    </motion.section>
  );
}
