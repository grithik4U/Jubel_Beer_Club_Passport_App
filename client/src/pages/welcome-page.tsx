import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function WelcomePage() {
  const [, setLocation] = useLocation();
  const [userName, setUserName] = useState("Oliver Pint");
  
  // Fetch the user's name when the component mounts
  useEffect(() => {
    async function fetchUserName() {
      try {
        const response = await fetch("/api/users/me");
        if (response.ok) {
          const userData = await response.json();
          setUserName(userData.name);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    }
    
    fetchUserName();
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-800 to-amber-950 flex flex-col items-center justify-center text-white p-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full flex flex-col items-center"
      >
        {/* Jubel Beer Logo */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative w-56 h-56 mb-8 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={() => setLocation("/passport")}
        >
          <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Beer Bottle */}
            <g>
              {/* Bottle */}
              <path d="M55,20 L65,20 L68,40 L67,95 L53,95 L52,40 Z" fill="#8b4513" />
              
              {/* Bottle Neck */}
              <path d="M57,10 L63,10 L65,20 L55,20 Z" fill="#8b4513" />
              
              {/* Bottle Cap */}
              <ellipse cx="60" cy="10" rx="5" ry="2" fill="#ffd700" />
              
              {/* Label */}
              <rect x="52" y="50" width="16" height="25" rx="2" fill="#f8e0a9" />
              
              {/* Jubel Text on Label */}
              <text x="60" y="65" fontSize="7" textAnchor="middle" fontWeight="bold" fill="#8b4513">JUBEL</text>
              
              {/* Beer Color Showing Through Bottle */}
              <path d="M54,42 L66,42 L65,90 L55,90 Z" fill="#f5d87e" fillOpacity="0.7" />
            </g>
            
            {/* Beer Bubbles */}
            <circle cx="60" cy="55" r="1" fill="#ffffff" fillOpacity="0.8" />
            <circle cx="57" cy="65" r="1.2" fill="#ffffff" fillOpacity="0.8" />
            <circle cx="62" cy="70" r="0.8" fill="#ffffff" fillOpacity="0.8" />
            <circle cx="59" cy="80" r="1.5" fill="#ffffff" fillOpacity="0.8" />
          </svg>
          
          {/* Subtle glow effect */}
          <div className="absolute inset-0 rounded-full bg-amber-500 filter blur-3xl opacity-20"></div>
        </motion.div>
        
        {/* Text */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-5xl font-bold mb-4 text-center bg-gradient-to-r from-amber-300 to-amber-100 bg-clip-text text-transparent"
        >
          Jubel Beer Club
        </motion.h1>
        
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-2xl mb-10 text-center"
        >
          Welcome, {userName}
        </motion.h2>
        
        {/* Enter Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <Button 
            onClick={() => setLocation("/passport")} 
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white rounded-full px-12 py-6 text-lg font-semibold shadow-lg"
          >
            Open My Beer Passport
          </Button>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="mt-8 text-center text-amber-200 opacity-70 text-sm"
        >
          Tap the bottle or button to continue
        </motion.p>
      </motion.div>
    </div>
  );
}