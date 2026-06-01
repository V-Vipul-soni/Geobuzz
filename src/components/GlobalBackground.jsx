"use client";
import { motion } from "framer-motion";

export default function GlobalBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">

      <div className="absolute inset-0 bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 opacity-40" />

      <motion.img
        src="/plane.png"
        alt="plane"
        className="absolute w-24 opacity-80"
        initial={{ x: "-20%", y: "70%" }}
        animate={{ x: "120%", y: "30%" }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
