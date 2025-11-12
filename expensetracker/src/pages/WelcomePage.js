import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaPiggyBank,
  FaWallet,
  FaChartLine,
  FaCoins,
  FaMoneyBillWave,
} from "react-icons/fa";
import "./WelcomePage.css";

export default function WelcomePage() {
  const navigate = useNavigate();

  // Array of budget-related icons
  const icons = [FaPiggyBank, FaWallet, FaChartLine, FaCoins, FaMoneyBillWave];

  // Generate many softly animated background icons
  const iconElements = Array.from({ length: 60 }).map((_, i) => {
    const Icon = icons[i % icons.length];
    const randomX = Math.random() * 100;
    const randomY = Math.random() * 100;
    const randomDuration = 10 + Math.random() * 10;
    const randomDelay = Math.random() * 5;
    const randomSize = 1.5 + Math.random() * 2.5; // different sizes

    return (
      <motion.div
        key={i}
        className="bg-icon"
        style={{
          top: `${randomY}%`,
          left: `${randomX}%`,
          fontSize: `${randomSize}rem`,
        }}
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
          opacity: [0.15, 0.25, 0.15],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: randomDuration,
          delay: randomDelay,
          ease: "easeInOut",
        }}
      >
        <Icon />
      </motion.div>
    );
  });

  return (
    <div className="welcome-page">
      {/* Floating animated background icons */}
      <div className="background-icons">{iconElements}</div>

      {/* Centered welcome card */}
      <motion.div
        className="welcome-card"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <h1>
          Welcome to <span>SmartBudget</span>
        </h1>
        <p>
          Track your income and expenses with ease.<br />
          Gain insights and take control of your financial future.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/login")}
          className="get-started"
        >
          Get Started →
        </motion.button>
      </motion.div>
    </div>
  );
}
