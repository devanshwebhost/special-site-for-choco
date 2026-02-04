"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { saveProgress, getProgress, logActivity, sendDataToEmail } from "@/utils/tracker";
import { Heart, Star, Gift } from "lucide-react";

// --- 1. CONFIGURATION: यहाँ अपनी इमेजेस बदलें ---
// हर स्टेज के लिए 3 अलग-अलग फोटोज के लिंक यहाँ डालें
const imagesPerStage = {
  welcome: [
    "/cryng.jpg", // Cute Panda 1
    "/cute-2.jpg", // Client Photo 1
    "/cute-hureey.jpg"  // Memory 1
  ],
  game: [
    "/cold.jpg", // Funny Cat
    "/cute-teeth.jpg", // Game Face
    "/tears.jpg"  // Excited
  ],
  final_check: [
    "/heart.jpg", // Couple Pic 1
    "/yee.jpg", // Couple Pic 2
    "/small-hands.jpg"  // Love Heart
  ]
};

// --- 2. HANGING FRAME COMPONENT (Mobile Optimized) ---
const HangingFrame = ({ src, delayByIndex }) => {
  const randomDuration = 2 + Math.random() * 0.5; 
  const randomAngle = 2 + Math.random() * 2;

  return (
    <div className="flex flex-col items-center relative z-20">
      {/* धागा (String) */}
      <div className="h-6 w-0.5 bg-rose-300 absolute -top-4"></div>

      {/* फ्रेम (Frame) */}
      <motion.div
        style={{ originY: "0px" }} 
        animate={{ rotate: [-randomAngle, randomAngle] }}
        transition={{
          duration: randomDuration,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
          delay: delayByIndex * 0.3
        }}
        // Mobile Width fix: w-24 (96px) ताकि 3 एक साथ आ सकें
        // Soft Corners: rounded-2xl
        className="bg-white p-1.5 shadow-lg rounded-2xl rotate-on-scroll-prevented mt-2"
      >
        <div className="w-24 h-24 overflow-hidden rounded-xl bg-gray-100">
          <img src={src} alt="memory" className="w-full h-full object-cover" />
        </div>
      </motion.div>
    </div>
  );
};

// --- 3. PRANK BUTTON (Pink Color Hardcoded) ---
const PrankButton = ({ onComplete }) => {
     const [step, setStep] = useState(0);
     const [position, setPosition] = useState({ x: 0, y: 0 });
   
     const steps = [
       { text: "Click here to see the surprise", icon: <Gift /> },
       { text: "Pehle batao will you be my valentine? 🥹🫣", icon: <Heart /> },
       { text: "Sachiiii 🥹😭", icon: <Star /> },
       { text: "Love you too 🥹", icon: <Heart fill="white" /> },
     ];
   
     const handleClick = () => {
       logActivity("button_click", { step: step, text: steps[step].text });
       if (step < steps.length - 1) {
         const screenW = window.innerWidth - 100; // Mobile Width check
         const screenH = window.innerHeight - 200;
         const x = Math.random() * (screenW/2) - (screenW/4); 
         const y = Math.random() * (screenH/2) - (screenH/4);
         setPosition({ x, y });
         setStep(step + 1);
       } else {
         confetti();
         onComplete();
       }
     };
   
     return (
       <div className="flex flex-col items-center gap-4">
         <img src="/shying-and-smiling.jpg" alt="Panda" className="w-28 h-28 rounded-2xl" />
         
         <motion.button
           animate={{ x: position.x, y: position.y }}
           transition={{ type: "spring", stiffness: 300 }}
           onClick={handleClick}
           // Hardcoded Styles for Guaranteed Pink & Soft Look
           style={{ backgroundColor: '#e11d48' }}
           className="text-white font-bold py-3 px-6 rounded-full shadow-xl flex items-center gap-2 text-md active:scale-95 transition-transform z-50"
         >
           {steps[step].icon}
           {steps[step].text}
         </motion.button>
       </div>
     );
};

// --- 4. CARD GAME (Reusable) ---
// --- 4. ADVANCED CARD GAME (Visual Shuffle + Blur) ---
const CardGame = ({ onWin }) => {
  // 1. कार्ड्स को Objects बनाएँ ताकि उनकी ID हमेशा सेम रहे (Animation के लिए ज़रूरी)
  const [cards, setCards] = useState([
    { id: 1, val: 10 }, { id: 2, val: 20 }, { id: 3, val: 30 },
    { id: 4, val: 40 }, { id: 5, val: 50 }, { id: 6, val: 60 },
    { id: 7, val: 70 }, { id: 8, val: 80 }, { id: 9, val: 90 },
    { id: 10, val: 100 }
  ]);
  
  const [isShuffling, setIsShuffling] = useState(true); 
  const [flippedId, setFlippedId] = useState(null); // ID track करेंगे, index नहीं
  const [message, setMessage] = useState(null);

  // --- Start Game / Shuffle Logic ---
  const shuffleCards = () => {
    setFlippedId(null);
    setMessage(null);
    setIsShuffling(true);

    // तुरंत शफल करें ताकि एनीमेशन शुरू हो
    // हम 2-3 बार शफल करेंगे ताकि यूजर को कार्ड्स हिलते हुए दिखें
    let interval = setInterval(() => {
        setCards(prev => [...prev].sort(() => Math.random() - 0.5));
    }, 400); // हर 0.4 सेकंड में जगह बदलेंगे

    // 2 सेकंड बाद रुकें और यूजर को खेलने दें
    setTimeout(() => {
        clearInterval(interval);
        setIsShuffling(false);
    }, 2000);
  };

  useEffect(() => {
    shuffleCards();
  }, []);

  // --- Click Logic ---
  const handleCardClick = (id, value) => {
    if (isShuffling || flippedId !== null) return;

    setFlippedId(id); // Flip this specific card ID

    if (value === 100) {
      setMessage("Yeeee 100% Love! 😭🥹😽");
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      setTimeout(onWin, 3000);
    } else {
      setMessage(`Only ${value}%? 😭 Retrying...`);
      setTimeout(() => {
        shuffleCards(); // Auto Restart with animation
      }, 2500);
    }
  };

  return (
    <div className="relative w-full px-2 py-4">
      <h2 className="text-2xl font-bold text-rose-600 mb-6 font-valentine text-center">
        Pick a Card!
      </h2>

      {/* --- BLUR OVERLAY (Shuffling Screen) --- */}
      <AnimatePresence>
        {isShuffling && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/40 backdrop-blur-sm rounded-xl"
            >
                {/* Cute Spinner or Icon */}
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="mb-2"
                >
                    <span className="text-4xl">💞</span>
                </motion.div>
                <p className="text-rose-600 font-bold font-bubbly text-xl drop-shadow-sm">
                    Mixing your luck...
                </p>
                <p className="text-rose-400 text-sm">Wait...</p>
            </motion.div>
        )}
      </AnimatePresence>

      {/* --- Message Box --- */}
      <div className="h-10 mb-2 text-center relative z-40">
        {message && (
             <motion.span 
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className={`px-4 py-1 rounded-full font-bold font-bubbly text-white ${message.includes('100%') ? 'bg-rose-500' : 'bg-rose-300'}`}
             >
                 {message}
             </motion.span>
        )}
      </div>

      {/* --- THE GRID --- */}
      <div className="grid grid-cols-5 gap-3 mx-auto max-w-sm relative">
        {/* 'layout' prop is the MAGIC here */}
        {cards.map((card) => (
          <div key={card.id} className="relative w-14 h-20 md:w-16 md:h-24 perspective-1000">
            <motion.div
              layout // <--- यह सबसे ज़रूरी है! यह आटोमेटिक एनीमेशन करता है जब जगह बदलती है
              transition={{ type: "spring", damping: 20, stiffness: 120 }} // Smooth Movement
              className="w-full h-full relative preserve-3d cursor-pointer"
              animate={{ 
                rotateY: flippedId === card.id ? 180 : 0,
              }}
              onClick={() => handleCardClick(card.id, card.val)}
              style={{ transformStyle: "preserve-3d" }}
            >
              
              {/* FRONT (Heart) */}
              <div 
                className="absolute w-full h-full backface-hidden bg-gradient-to-br from-rose-400 to-rose-300 rounded-lg flex items-center justify-center shadow-md border-2 border-white"
                style={{ backfaceVisibility: "hidden" }}
              >
                <span className="text-2xl">❤️</span>
              </div>

              {/* BACK (Number) */}
              <div 
                className="absolute w-full h-full backface-hidden bg-white rounded-lg flex items-center justify-center shadow-md border-2 border-rose-500"
                style={{ 
                    backfaceVisibility: "hidden", 
                    transform: "rotateY(180deg)" 
                }}
              >
                <span className="text-md md:text-xl font-bold font-bubbly text-rose-600">
                  {card.val === 100 ? "100" : `${card.val}%`}
                </span>
              </div>

            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};


// --- MAIN PAGE ---
export default function ValentinePage() {
  const [stage, setStage] = useState('welcome'); // welcome, game, final_check
  const [clientName, setClientName] = useState("Choco this is for you babe💕");

  // Get current images based on stage, default to welcome if stage not found
  const currentImages = imagesPerStage[stage === 'transition' ? 'welcome' : stage] || imagesPerStage.welcome;

  useEffect(() => {
    // Progress loading logic
    const saved = getProgress();
    if(saved && saved !== 'loading') setStage(saved);
  }, []);

  const handleWelcomeComplete = () => {
    setStage('transition'); 
    setTimeout(() => {
        setStage('game');
        saveProgress('game');
    }, 4000);
  };

  const handleGameWin = () => {
    setStage('final_check');
    saveProgress('final_check');
  };

  return (
    // padding-top (pt-32) बढ़ाया ताकि frames कंटेंट को न ढकें
    <main className="min-h-screen bg-pink-50 flex flex-col items-center justify-start pt-36 p-4 relative overflow-hidden">
      
      {/* --- TOP HANGING FRAMES CONTAINER --- */}
      {/* यह container हमेशा रहेगा, बस इमेजेज बदलेंगी */}
      <div className="absolute top-0 left-0 w-full flex justify-center gap-3 md:gap-8 z-30 pointer-events-none pt-2">
         <AnimatePresence mode="wait">
            {currentImages.map((src, index) => (
                <motion.div
                    key={stage + index} // Key change hone se animation restart hogi
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <HangingFrame src={src} delayByIndex={index} />
                </motion.div>
            ))}
         </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        
        {/* STAGE 1: WELCOME */}
        {stage === 'welcome' && (
          <motion.div 
            key="welcome"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center w-full max-w-md flex flex-col items-center"
          >
            <h1 className="text-4xl text-rose-600 font-bold mb-2">{clientName}</h1>
            <p className="text-rose-400 mb-6 text-lg">Small gift for you... 🎁</p>
            <PrankButton onComplete={handleWelcomeComplete} />
          </motion.div>
        )}

        {/* STAGE 2: TRANSITION */}
        {stage === 'transition' && (
          <motion.div 
             key="trans"
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             exit={{ scale: 0 }}
             className="text-center"
          >
             <h2 className="text-3xl font-bold text-rose-500 animate-pulse mb-4">Wait for next step...</h2>
             <img src="/moi-tan.png" alt="Waiting" className="w-48 rounded-2xl mx-auto shadow-lg"/>
          </motion.div>
        )}

        {/* STAGE 3: GAME */}
        {stage === 'game' && (
          <motion.div 
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-md"
          >
            <CardGame onWin={handleGameWin} />
          </motion.div>
        )}

        {/* STAGE 4: FINAL */}
        {stage === 'final_check' && (
           <div className="text-center">
             <h1 className="text-4xl text-rose-600 font-bold mb-4">Babe💕ab Valentine day per vapas open karna site ko 🫣🥰 love you jaan...😽</h1>
             <p className="text-gray-600 bg-white p-4 rounded-xl shadow-sm">
                Rest of the days will unlock automatically!
             </p>
           </div>
        )}

      </AnimatePresence>
    </main>
  );
}