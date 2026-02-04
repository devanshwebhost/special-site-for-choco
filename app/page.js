"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { saveProgress, getProgress, logActivity, sendDataToEmail } from "@/utils/tracker";
import { Heart, Star, Gift, Volume2, VolumeX } from "lucide-react";

// --- 1. CONFIGURATION & ASSETS ---

// आपकी इमेजेस (User Defined)
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

// साउंड और वीडियो assets (इनको आप बदल सकते हैं)
const ASSETS = {
  bgVideo: "/vid/heart-flow.mp4", // Hearts Loop
  music: "/vid/kamado.mp3", // Background Music
  popSound: "/vid/pop.mp3", // Card Flip
  wooshSound: "/vid/woosh.mp3", // Move
  winSound: "/vid/win.mp3", // Win
};

// --- UTILITY: Play Sound ---
const playSound = (url) => {
  const audio = new Audio(url);
  audio.volume = 0.5;
  audio.play().catch(e => console.log("Sound blocked", e));
};

// --- COMPONENT: PRELOADER (ताकि साइट अटके नहीं) ---
const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let loadedCount = 0;
    // सारी इमेजेस को एक लिस्ट में निकाल रहे हैं
    const allImages = [...imagesPerStage.welcome, ...imagesPerStage.game, ...imagesPerStage.final_check, "/shying-and-smiling.jpg", "/moi-tan.png"];
    const totalAssets = allImages.length + 2; // Images + Video + Audio

    const updateProgress = () => {
      loadedCount++;
      const percent = Math.floor((loadedCount / totalAssets) * 100);
      setProgress(prev => (percent > prev ? percent : prev));
      if (loadedCount >= totalAssets) {
        setTimeout(onComplete, 800); // 100% पर थोड़ा रुकें
      }
    };

    // Images Load
    allImages.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = updateProgress;
      img.onerror = updateProgress;
    });

    // Video Load check
    const vid = document.createElement('video');
    vid.src = ASSETS.bgVideo;
    vid.onloadeddata = updateProgress;
    vid.onerror = updateProgress;

    // Audio Load check
    const aud = new Audio();
    aud.src = ASSETS.music;
    aud.oncanplaythrough = updateProgress;
    aud.onerror = updateProgress;

    // Safety Fallback (5 sec max wait)
    setTimeout(onComplete, 5000); 
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-rose-50 flex flex-col items-center justify-center">
      <img src="/shying-and-smiling.jpg" className="w-24 h-24 rounded-full mb-4 object-cover animate-bounce" />
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-rose-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-rose-500 font-bubbly font-bold">Loading Love... {progress}%</p>
    </div>
  );
};

// --- NEW COMPONENT: MUSIC REQUEST MODAL ---
// --- NEW COMPONENT: MUSIC REQUEST MODAL ---
const MusicModal = ({ onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl border-4 border-rose-300"
      >
        <div className="flex justify-center mb-4">
          <div className="bg-rose-100 p-4 rounded-full">
            {/* Music Icon: Make sure to import Music from lucide-react */}
            <Volume2 className="w-10 h-10 text-rose-500 animate-pulse" />
          </div>
        </div>
        <h2 className="text-2xl font-valentine font-bold text-rose-600 mb-2">Turn up the volume! 🔊</h2>
        <p className="text-gray-500 font-bubbly mb-6">
          This experience is best enjoyed with music.
        </p>
        <button 
          onClick={onConfirm}
          className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-xl font-bubbly transition-transform active:scale-95 shadow-lg flex items-center justify-center gap-2"
        >
          <Heart fill="white" size={20} />
          Okay, Let's Start!
        </button>
      </motion.div>
    </div>
  );
};

// --- COMPONENT: BACKGROUND CONTROLLER (Video + Music) ---
// --- UPDATED BACKGROUND CONTROLLER ---
// --- UPDATED BACKGROUND CONTROLLER ---
const BackgroundController = ({ audioRef }) => {
  const [isPlaying, setIsPlaying] = useState(true);

  const toggleMusic = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10"></div>
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-80">
          <source src={ASSETS.bgVideo} type="video/mp4" />
        </video>
      </div>

      <button 
        onClick={toggleMusic}
        className="fixed bottom-4 right-4 z-50 bg-rose-500 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
      >
        {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>
    </>
  );
};


// --- 2. HANGING FRAME COMPONENT ---
const HangingFrame = ({ src, delayByIndex }) => {
  const randomDuration = 2 + Math.random() * 0.5; 
  const randomAngle = 2 + Math.random() * 2;

  return (
    <div className="flex flex-col items-center relative z-20">
      <div className="h-6 w-0.5 bg-rose-300 absolute -top-4"></div>
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
        className="bg-white p-1.5 shadow-lg rounded-2xl rotate-on-scroll-prevented mt-2"
      >
        <div className="w-24 h-24 overflow-hidden rounded-xl bg-gray-100">
          <img src={src} alt="memory" className="w-full h-full object-cover" />
        </div>
      </motion.div>
    </div>
  );
};

// --- 3. PRANK BUTTON (Updated with Sound) ---
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
         playSound(ASSETS.wooshSound); // 🔊 Sound Effect
         const screenW = window.innerWidth - 100;
         const screenH = window.innerHeight - 200;
         const x = Math.random() * (screenW/2) - (screenW/4); 
         const y = Math.random() * (screenH/2) - (screenH/4);
         setPosition({ x, y });
         setStep(step + 1);
       } else {
         playSound(ASSETS.winSound); // 🔊 Win Sound
         confetti();
         onComplete();
       }
     };
   
     return (
       <div className="flex flex-col items-center gap-4">
         <img src="/shying-and-smiling.jpg" alt="Panda" className="w-28 h-28 rounded-2xl shadow-md" />
         
         <motion.button
           animate={{ x: position.x, y: position.y }}
           transition={{ type: "spring", stiffness: 300 }}
           onClick={handleClick}
           style={{ backgroundColor: '#e11d48' }}
           className="text-white font-bold py-3 px-6 rounded-full shadow-xl flex items-center gap-2 text-md active:scale-95 transition-transform z-50 border-2 border-white/30"
         >
           {steps[step].icon}
           {steps[step].text}
         </motion.button>
       </div>
     );
};

// --- 4. ADVANCED CARD GAME (Updated with Sound) ---
const CardGame = ({ onWin }) => {
  const [cards, setCards] = useState([
    { id: 1, val: 10 }, { id: 2, val: 20 }, { id: 3, val: 30 },
    { id: 4, val: 40 }, { id: 5, val: 50 }, { id: 6, val: 60 },
    { id: 7, val: 70 }, { id: 8, val: 80 }, { id: 9, val: 90 },
    { id: 10, val: 100 }
  ]);
  
  const [isShuffling, setIsShuffling] = useState(true); 
  const [flippedId, setFlippedId] = useState(null);
  const [message, setMessage] = useState(null);

  const shuffleCards = () => {
    setFlippedId(null);
    setMessage(null);
    setIsShuffling(true);
    playSound(ASSETS.wooshSound); // 🔊 Shuffle Sound

    let interval = setInterval(() => {
        setCards(prev => [...prev].sort(() => Math.random() - 0.5));
    }, 400);

    setTimeout(() => {
        clearInterval(interval);
        setIsShuffling(false);
    }, 2000);
  };

  useEffect(() => {
    shuffleCards();
  }, []);

  const handleCardClick = (id, value) => {
    if (isShuffling || flippedId !== null) return;

    setFlippedId(id);
    playSound(ASSETS.popSound); // 🔊 Flip Sound

    if (value === 100) {
      setMessage("Yeeee 100% Love! 😭🥹😽");
      playSound(ASSETS.winSound); // 🔊 Win Sound
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      setTimeout(onWin, 3000);
    } else {
      setMessage(`Only ${value}%? 😭 Retrying...`);
      setTimeout(() => {
        shuffleCards();
      }, 2500);
    }
  };

  return (
    <div className="relative w-full px-2 py-4">
      <h2 className="text-2xl font-bold text-rose-600 mb-6 font-valentine text-center">
        Pick a Card!
      </h2>

      <AnimatePresence>
        {isShuffling && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/40 backdrop-blur-sm rounded-xl"
            >
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="mb-2"
                >
                    <span className="text-4xl">💞</span>
                </motion.div>
                <p className="text-rose-600 font-bold font-bubbly text-xl drop-shadow-sm">Mixing your luck...</p>
                <p className="text-rose-400 text-sm">Wait...</p>
            </motion.div>
        )}
      </AnimatePresence>

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

      <div className="grid grid-cols-5 gap-3 mx-auto max-w-sm relative">
        {cards.map((card) => (
          <div key={card.id} className="relative w-14 h-20 md:w-16 md:h-24 perspective-1000">
            <motion.div
              layout 
              transition={{ type: "spring", damping: 20, stiffness: 120 }}
              className="w-full h-full relative preserve-3d cursor-pointer"
              animate={{ rotateY: flippedId === card.id ? 180 : 0 }}
              onClick={() => handleCardClick(card.id, card.val)}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-rose-400 to-rose-300 rounded-lg flex items-center justify-center shadow-md border-2 border-white" style={{ backfaceVisibility: "hidden" }}>
                <span className="text-2xl">❤️</span>
              </div>
              <div className="absolute w-full h-full backface-hidden bg-white rounded-lg flex items-center justify-center shadow-md border-2 border-rose-500" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                <span className="text-md md:text-xl font-bold font-bubbly text-rose-600">{card.val === 100 ? "100" : `${card.val}%`}</span>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};


// --- MAIN PAGE ---
// --- MAIN PAGE ---
// --- MAIN PAGE ---
export default function ValentinePage() {
  const [loading, setLoading] = useState(true); 
  const [musicPrompt, setMusicPrompt] = useState(true); 
  const [stage, setStage] = useState('welcome'); 
  const [clientName, setClientName] = useState("Choco this is for you babe💕");
  
  // Audio Ref
  const audioRef = useRef(null);

  const currentImages = imagesPerStage[stage === 'transition' ? 'welcome' : stage] || imagesPerStage.welcome;

  useEffect(() => {
    const saved = getProgress();
    if(saved && saved !== 'loading') setStage(saved);
  }, []);

  // --- FIXED MUSIC FUNCTION ---
  const handleMusicConfirm = () => {
    // अब audioRef null नहीं होगा क्योंकि audio टैग रेंडर हो चुका है
    if (audioRef.current) {
      // 🔥 VOLUME SETTING HERE (0.0 to 1.0)
        audioRef.current.volume = 0.3; // 40% Volume (Recommended)
        audioRef.current.currentTime = 50; // Skip 5 seconds
        audioRef.current.play()
            .then(() => {
                console.log("Audio playing!");
            })
            .catch(e => console.log("Audio play failed:", e));
    }
    setMusicPrompt(false); // Modal हटाओ
  };

  const handleWelcomeComplete = () => {
    setStage('transition'); 
    sendDataToEmail();
    setTimeout(() => {
        setStage('game');
        saveProgress('game');
    }, 4000);
  };

  const handleGameWin = () => {
    setStage('final_check');
    saveProgress('final_check');
    sendDataToEmail();
  };

  // --- RENDER ---
  return (
    <main className="min-h-screen flex flex-col items-center justify-start pt-36 p-4 relative overflow-hidden">
      
      {/* --- 🔥 FIX: Audio Tag को यहाँ सबसे ऊपर रखें (Always Rendered) --- */}
      {/* इसे 'hidden' न करें, बस CSS से छिपाएं ताकि ref काम करे */}
      <audio 
        ref={audioRef} 
        src={ASSETS.music} 
        loop 
        preload="auto"
        style={{ display: 'none' }} 
      />

      {/* 1. LOADING SCREEN */}
      {loading ? (
        <Preloader onComplete={() => setLoading(false)} />
      ) : musicPrompt ? (
        /* 2. MUSIC REQUEST MODAL */
        <MusicModal onConfirm={handleMusicConfirm} />
      ) : (
        /* 3. MAIN SITE CONTENT (जब लोडिंग और म्यूजिक कन्फर्म हो जाए) */
        <>
          {/* Background Controller */}
          <BackgroundController audioRef={audioRef} />

          <div className="absolute top-0 left-0 w-full flex justify-center gap-3 md:gap-8 z-30 pointer-events-none pt-2">
             <AnimatePresence mode="wait">
                {currentImages.map((src, index) => (
                    <motion.div
                        key={stage + index}
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
            
            {/* WELCOME */}
            {stage === 'welcome' && (
              <motion.div 
                key="welcome"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center w-full max-w-md flex flex-col items-center"
              >
                <h1 className="text-4xl text-rose-600 font-bold mb-2">{clientName}</h1>
                <p className="text-rose-400 mb-6 text-lg font-bubbly">Love you jaan... 🎁</p>
                <PrankButton onComplete={handleWelcomeComplete} />
              </motion.div>
            )}

            {/* TRANSITION */}
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

            {/* GAME */}
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

            {/* FINAL */}
            {stage === 'final_check' && (
               <div className="text-center bg-white/70 p-6 rounded-2xl backdrop-blur-md shadow-xl">
                 <h1 className="text-4xl text-rose-600 font-bold mb-4">Babe💕ab Valentine day per vapas open karna site ko 🫣🥰 love you jaan...😽</h1>
                 <p className="text-gray-600 font-bubbly">
                    Rest of the days will unlock automatically!
                 </p>
               </div>
            )}

          </AnimatePresence>
        </>
      )}
    </main>
  );
}