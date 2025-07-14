"use client";
import { motion } from "framer-motion";

export default function HamburgerToggle({ isOpen, toggle }) {
  return (
    <button
      onClick={toggle}
      className="relative w-8 h-8 flex items-center justify-center focus:outline-none"
      aria-label="Menu Toggle"
    >
      {/* Top bar */}
      <motion.span
        className="absolute w-8 h-0.5 bg-black dark:bg-white"
        animate={{
          rotate: isOpen ? 45 : 0,
          y: isOpen ? 0 : -8,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      />

      {/* Middle bar */}
      <motion.span
        className="absolute w-8 h-0.5 bg-black dark:bg-white"
        animate={{
          opacity: isOpen ? 0 : 1,
          y: 0,
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Bottom bar */}
      <motion.span
        className="absolute w-8 h-0.5 bg-black dark:bg-white"
        animate={{
          rotate: isOpen ? -45 : 0,
          y: isOpen ? 0 : 8,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      />
    </button>
  );
}
