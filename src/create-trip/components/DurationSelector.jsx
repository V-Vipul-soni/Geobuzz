import { motion } from "framer-motion";
import { FaCalendarAlt, FaMinus, FaPlus } from "react-icons/fa";

export default function DurationSelector({ tripDays, adjustDays, setTripDays, handleInputChange }) {
  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
      className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl p-5 border border-blue-100 dark:border-blue-900/50 shadow-sm">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
        <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center">
          <FaCalendarAlt className="text-blue-600 dark:text-blue-400 text-xs" />
        </span>
        How many days?
      </label>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-4 ml-9">Pick a duration or use the stepper</p>
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => adjustDays(-1)}
          className="w-10 h-10 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-violet-400 dark:hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-950/40 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-all duration-150 active:scale-95">
          <FaMinus className="text-xs" />
        </button>
        <div className="min-w-[72px] text-center">
          <motion.span key={tripDays} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-extrabold text-gray-900 dark:text-white block leading-none">{tripDays}</motion.span>
          <span className="text-gray-400 dark:text-gray-500 text-xs">{tripDays === 1 ? "day" : "days"}</span>
        </div>
        <button onClick={() => adjustDays(1)}
          className="w-10 h-10 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-violet-400 dark:hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-950/40 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-all duration-150 active:scale-95">
          <FaPlus className="text-xs" />
        </button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {[3, 5, 7, 10, 14].map((d) => (
          <button key={d} onClick={() => { setTripDays(d); handleInputChange("noOfDays", d); }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border-2 transition-all duration-150 active:scale-95 ${
              tripDays === d
                ? "bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-200 dark:shadow-none"
                : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-violet-400 dark:hover:border-violet-500 hover:text-violet-600 dark:hover:text-violet-400 bg-white dark:bg-gray-900"
            }`}>
            {d} days
          </button>
        ))}
      </div>
    </motion.section>
  );
}
