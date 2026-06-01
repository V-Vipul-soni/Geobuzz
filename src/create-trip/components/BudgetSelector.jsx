import { motion } from "framer-motion";
import { FaWallet, FaCheckCircle } from "react-icons/fa";
import { SelectBudgetOptions } from "../../constants/options";

export default function BudgetSelector({ selectedBudget, setSelectedBudget, handleInputChange }) {
  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
      className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl p-5 border border-emerald-100 dark:border-emerald-900/50 shadow-sm">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
        <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center">
          <FaWallet className="text-emerald-600 dark:text-emerald-400 text-xs" />
        </span>
        What's your budget?
      </label>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-4 ml-9">We'll tailor recommendations to match</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {SelectBudgetOptions.map((item) => (
          <motion.button key={item.id} whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}
            onClick={() => { setSelectedBudget(item.title); handleInputChange("budget", item.title); }}
            className={`relative p-5 rounded-2xl text-left transition-all duration-200 border-2 overflow-hidden ${
              selectedBudget === item.title
                ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 shadow-lg shadow-emerald-100 dark:shadow-none"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-emerald-300 dark:hover:border-emerald-500 hover:shadow-md"
            }`}>
            {selectedBudget === item.title && (
              <span className="absolute top-2 right-2 w-4 h-4 bg-emerald-600 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-white text-[8px]" />
              </span>
            )}
            <span className="text-3xl block mb-2">{item.icon}</span>
            <span className="font-bold text-gray-800 dark:text-gray-200 capitalize block">{item.title}</span>
            <span className="text-gray-400 dark:text-gray-500 text-xs">{item.desc}</span>
          </motion.button>
        ))}
      </div>
    </motion.section>
  );
}
