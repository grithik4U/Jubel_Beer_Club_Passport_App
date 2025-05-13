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
        {/* Overflowing Beer Glass */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative w-56 h-56 mb-8 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={() => setLocation("/passport")}
        >
          <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Base for the foam overflow */}
            <ellipse cx="60" cy="28" rx="30" ry="6" fill="#FFFFFF" opacity="0.9" />
            
            {/* The beer glass */}
            <path d="M45,30 L40,90 C40,95 80,95 80,90 L75,30 Z" fill="#d1a738" fillOpacity="0.2" stroke="#d1a738" strokeWidth="0.5" />
            
            {/* The beer inside the glass */}
            <path d="M45,30 L41,85 C47,90 73,90 79,85 L75,30 Z" fill="#f5d87e" />
            
            {/* Glass highlights */}
            <path d="M45,30 L42,80 L44,82 L47,30 Z" fill="#FFFFFF" fillOpacity="0.3" />
            <path d="M75,30 L78,80 L76,82 L73,30 Z" fill="#000000" fillOpacity="0.05" />
            
            {/* Foam head inside glass */}
            <path d="M45,30 Q60,20 75,30" fill="#FFFFFF" />
            
            {/* Overflowing foam dripping down the sides */}
            <g opacity="0.9">
              {/* Main foam on top */}
              <path d="M44,30 Q45,15 55,20 Q65,10 75,20 Q85,15 76,30" fill="#FFFFFF" />
              
              {/* Foam drips */}
              <path d="M48,30 Q47,35 50,40 Q52,43 48,45" fill="#FFFFFF" />
              <path d="M60,28 Q59,38 62,42" fill="#FFFFFF" />
              <path d="M70,29 Q72,38 68,45 Q65,50 67,55" fill="#FFFFFF" />
            </g>
            
            {/* Beer bubbles */}
            <circle cx="50" cy="45" r="1.5" fill="#FFFFFF" fillOpacity="0.8" />
            <circle cx="55" cy="60" r="2" fill="#FFFFFF" fillOpacity="0.8" />
            <circle cx="65" cy="50" r="1.8" fill="#FFFFFF" fillOpacity="0.8" />
            <circle cx="60" cy="75" r="2.2" fill="#FFFFFF" fillOpacity="0.8" />
            <circle cx="52" cy="68" r="1.2" fill="#FFFFFF" fillOpacity="0.8" />
            <circle cx="70" cy="65" r="1" fill="#FFFFFF" fillOpacity="0.8" />
            
            {/* Glass base */}
            <path d="M40,90 C40,100 80,100 80,90" fill="#d1a738" fillOpacity="0.2" stroke="#d1a738" strokeWidth="0.5" />
            
            {/* Jubel text on the glass */}
            <text x="60" y="60" fontSize="8" textAnchor="middle" fontWeight="bold" fill="#8b4513" opacity="0.7">JUBEL</text>
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