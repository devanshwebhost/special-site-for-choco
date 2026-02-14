"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart, Volume2, VolumeX, Sparkles, Music } from "lucide-react";

// --- 1. TIMELINE DATA (Updated for Voice, Video & Photo) ---
// यहाँ मैंने 'type' जोड़ दिया है ('voice', 'video', 'image')
// आपको src में अपनी असली वीडियो और ऑडियो के लिंक डालने होंगे।
const timelineData = [
  {
    id: 1,
    type: "video", // 🎤 Voice Note
    date: "2 Nov 2024",
    title: "Where it all started... ✨",
    desc: "Apka pehla voice note, 😭",
    src: "/vid/voice-note.mp4" // यहाँ अपना Voice Note डालें
  },
  {
    id: 2,
    type: "image", // 🎬 Video
    date: "November 2024",
    title: "Haye aapki eyes 😭",
    desc: "Inko dekh ke haye kya bataun... 🥺",
    src: "/vid/eyes.jpg" // यहाँ अपनी Video डालें
  },
  {
    id: 3,
    type: "video", // 📸 Photo
    date: "December 2024",
    title: "Ap Coco ko pyar karte hue 😭😭😭",
    desc: "Meko bhi karna esa pyar 🥺💕",
    src: "/vid/coco.mp4"
  },
  {
    id: 4,
    type: "image", // 🎬 Video
    date: "2025",
    title: "Can't live without you 🥺",
    desc: "Realizing you are my forever.",
    src: "/vid/cute-smile.jpg" // यहाँ अपनी Video डालें
  },
  {
    id: 5,
    type: "video", // 📸 Photo
    date: "2025",
    title: "Ha babe ha! 💖",
    desc: "meko aapse bhot sari baat karni hai 🥺💕",
    src: "/vid/babukobaat.mp4"
  },
  {
    id: 6,
    type: "video", // 🎬 Video
    date: "2025",
    title: "Aapki masti 😽",
    desc: "You are my paya bacha 🫣🥰🥹",
    src: "/vid/focus.mp4" // यहाँ अपनी Video डालें
  },
  {
    id: 7,
    type: "image", // 📸 Photo
    date: "2025",
    title: "Ake din sach me 🥹",
    desc: "ese mere kandhe per sir rakhna aap fir me aapko bhot sara pyar karunga 🥺💕",
    src: "/vid/saathme.jpg"
  },
  {
    id: 8,
    type: "video", // 🎬 Video
    date: "2025",
    title: "Meri Queen 😭",
    desc: "🫣🥰🥹 ye meko bhot pasand hai video 😽😽😽😽😽",
    src: "/vid/queen.mp4" // यहाँ अपनी Video डालें
  },
  {
    id: 9,
    type: "image", // 📸 Photo
    date: "The Year 2026",
    title: "Mera babe pyaara sa 😭",
    desc: "Ap ese hi bethe raho me aapko dekhta rahu🥹",
    src: "/vid/orgg.jpg"
  }
];

const finaleImages = [
  "/vid/berojgar.jpg", "/vid/eyes.jpg", "/vid/hand.jpg", 
  "/vid/golgappa.jpg", "/vid/cute-smile.jpg", "/vid/orgg.jpg",
  "/vid/saathme.jpg"
];

// --- 2. FLOATING BACKGROUND WORDS ---
const FloatingWords = () => {
  const words = ["Love you 💕", "My Babe 🥺", "Forever ✨", "Cutie 😽", "Jaan 💖", "Mine 💍", "Choco 🍫"];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {words.map((word, i) => {
        const randomX = Math.random() * 100; // 0 to 100vw
        const duration = 15 + Math.random() * 10;
        const delay = Math.random() * 10;
        return (
          <motion.div
            key={i}
            initial={{ y: "110vh", x: `${randomX}vw`, opacity: 0.3 + Math.random() * 0.4 }}
            animate={{ y: "-10vh" }}
            transition={{ duration: duration, repeat: Infinity, delay: delay, ease: "linear" }}
            className="absolute text-rose-300 font-valentine text-2xl md:text-4xl whitespace-nowrap"
          >
            {word}
          </motion.div>
        );
      })}
    </div>
  );
};

// --- 3. MUSIC REQUEST MODAL (Popup) ---
const MusicModal = ({ onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border-4 border-rose-300"
      >
        <div className="flex justify-center mb-4">
          <div className="bg-rose-100 p-4 rounded-full">
            <Volume2 className="w-12 h-12 text-rose-500 animate-pulse" />
          </div>
        </div>
        <h2 className="text-3xl font-valentine font-bold text-rose-600 mb-2">Turn on Audio! 🔊</h2>
        <p className="text-gray-500 font-bubbly mb-6">Experience our journey with music.</p>
        <button 
          onClick={onConfirm}
          className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-full font-bubbly text-xl transition-transform active:scale-95 shadow-lg flex items-center justify-center gap-2 animate-bounce"
        >
          <Heart fill="white" size={24} /> Okay, Let's Start!
        </button>
      </motion.div>
    </div>
  );
};

// --- 4. FINALE FLOATING IMAGES ---
const FloatingImage = ({ src, delay }) => {
  const randomX = Math.random() * 80 - 40; 
  const randomScale = 0.6 + Math.random() * 0.6; 
  const duration = 10 + Math.random() * 10; 
  const randomRotate = Math.random() * 40 - 20;

  return (
    <motion.img
      src={src}
      initial={{ y: "120vh", x: `${randomX}vw`, scale: randomScale, rotate: randomRotate, opacity: 0.9 }}
      animate={{ y: "-120vh", rotate: randomRotate * -1 }}
      transition={{ duration: duration, repeat: Infinity, delay: delay, ease: "linear" }}
      className="absolute w-32 h-40 object-cover rounded-xl shadow-2xl border-4 border-white z-10"
    />
  );
};

// --- MAIN PAGE ---
export default function JourneyPage() {
  const [musicPrompt, setMusicPrompt] = useState(true);
  const [isFinale, setIsFinale] = useState(false);
  const [isBgmPlaying, setIsBgmPlaying] = useState(false);

  const bgmRef = useRef(null);
  const finaleBgmRef = useRef(null);

  // --- AUDIO LOGIC ---
  const handleStartJourney = () => {
    if (bgmRef.current) {
      bgmRef.current.volume = 0.3; // BGM वॉल्यूम कम ताकि वॉयस नोट साफ़ सुनाई दे
      bgmRef.current.play().catch(e => console.log(e));
      setIsBgmPlaying(true);
    }
    setMusicPrompt(false);
  };

  // जब वीडियो/वॉयस नोट प्ले हो तो BGM रोकें
  const pauseBGM = () => {
    if (bgmRef.current && isBgmPlaying && !isFinale) {
      bgmRef.current.pause();
      setIsBgmPlaying(false);
    }
  };

  // जब वीडियो/वॉयस नोट रुके तो BGM वापस चलाएं (वहीं से)
  const resumeBGM = () => {
    if (bgmRef.current && !isBgmPlaying && !isFinale) {
      bgmRef.current.play().catch(e => console.log(e));
      setIsBgmPlaying(true);
    }
  };

  const toggleGlobalBGM = () => {
    const activeRef = isFinale ? finaleBgmRef.current : bgmRef.current;
    if (isBgmPlaying) activeRef?.pause();
    else activeRef?.play();
    setIsBgmPlaying(!isBgmPlaying);
  };

  const handleFinaleTrigger = () => {
    setIsFinale(true);
    confetti({ particleCount: 300, spread: 100, origin: { y: 0.5 } });
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Switch Music
    if (bgmRef.current) bgmRef.current.pause();
    if (finaleBgmRef.current) {
      finaleBgmRef.current.currentTime = 0;
      finaleBgmRef.current.volume = 0.6;
      finaleBgmRef.current.play().catch(e => console.log(e));
      setIsBgmPlaying(true);
    }
  };

  if (musicPrompt) return <MusicModal onConfirm={handleStartJourney} />;

  return (
    <main className={`min-h-screen relative overflow-hidden transition-colors duration-1000 ${isFinale ? 'bg-rose-950' : 'bg-pink-50'}`}>
      
      {/* --- HIDDEN BGM AUDIOS --- */}
      <audio ref={bgmRef} src="/vid/thousand.mp3" loop preload="auto" />
      <audio ref={finaleBgmRef} src="/vid/until.mp3" loop preload="auto" /> 

      {/* --- GLOBAL VOLUME BUTTON --- */}
      <button 
        onClick={toggleGlobalBGM}
        className="fixed bottom-4 right-4 z-[100] bg-rose-500 text-white p-3 rounded-full shadow-xl hover:scale-110 transition-transform"
      >
        {isBgmPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>

      {/* --- FLOATING BACKGROUND WORDS --- */}
      {!isFinale && <FloatingWords />}

      <AnimatePresence>
        {!isFinale ? (
          // ====================
          // STAGE 1: ZIG-ZAG TIMELINE
          // ====================
          <motion.div 
            key="timeline"
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            transition={{ duration: 1 }}
            className="max-w-xl mx-auto pt-16 pb-32 px-2 relative z-10"
          >
            <h1 className="text-5xl font-valentine text-center text-rose-600 mb-2 drop-shadow-sm">Our Beautiful Journey</h1>
            <p className="text-center text-rose-500 font-bubbly text-lg mb-16 font-bold bg-white/50 backdrop-blur-sm py-2 rounded-full w-max mx-auto px-6">
              From strangers to soulmates 🥺💕
            </p>

            {/* Central Line for Zig-Zag */}
            <div className="absolute left-1/2 -translate-x-1/2 top-48 bottom-40 w-1 bg-rose-300 opacity-50 z-0 hidden md:block"></div>

            {/* TIMELINE ITEMS */}
            <div className="relative z-10 space-y-12">
              {timelineData.map((item, index) => {
                // Alternating logic (Zig-Zag)
                const isLeft = index % 2 === 0;

                return (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                    // Mobile पर 85% width लेकर इसे लेफ्ट या राइट खिसकाएंगे
                    className={`flex w-full ${isLeft ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className="w-[85%] md:w-[45%] bg-white/90 backdrop-blur-sm p-4 rounded-3xl shadow-xl border-2 border-rose-100 relative">
                      
                      {/* Date Badge */}
                      <span className="absolute -top-4 left-4 bg-rose-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-md font-bubbly">
                        {item.date}
                      </span>

                      {/* --- DYNAMIC MEDIA RENDERING --- */}
                      <div className="mt-3 mb-4 rounded-xl overflow-hidden shadow-inner bg-rose-50 border border-rose-100">
                        {item.type === 'voice' && (
                          <div className="p-4 flex flex-col items-center">
                            <Music className="text-rose-400 mb-2 animate-bounce" size={32} />
                            <p className="text-sm font-bubbly text-rose-500 mb-2 font-bold">Play Voice Note 🎤</p>
                            {/* 🔥 Audio Tag triggers BGM Pause/Play */}
                            <audio 
                              controls src={item.src} className="w-full h-10"
                              onPlay={pauseBGM} onPause={resumeBGM} onEnded={resumeBGM}
                            />
                          </div>
                        )}

                        {item.type === 'video' && (
                          // 🔥 Video Tag triggers BGM Pause/Play
                          <video 
                            controls src={item.src} className="w-full max-h-56 object-cover"
                            onPlay={pauseBGM} onPause={resumeBGM} onEnded={resumeBGM}
                          />
                        )}

                        {item.type === 'image' && (
                          <img src={item.src} alt={item.title} className="w-full h-48 object-cover" />
                        )}
                      </div>

                      {/* Text Content */}
                      <h3 className="text-xl font-bold text-rose-600 font-bubbly leading-tight mb-1">{item.title}</h3>
                      <p className="text-gray-600 text-sm font-bubbly font-medium">{item.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* FINALE TRIGGER BUTTON */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-24 text-center flex flex-col items-center relative z-20"
            >
              <h2 className="text-3xl font-valentine text-rose-600 mb-6 drop-shadow-md bg-white/50 px-6 py-2 rounded-full">
                But wait... there is more! 🫣
              </h2>
              <button 
                onClick={handleFinaleTrigger}
                className="relative group bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bubbly font-bold text-2xl py-5 px-10 rounded-full shadow-[0_0_30px_rgba(225,29,72,0.4)] flex items-center gap-3 animate-bounce active:scale-95 transition-all"
              >
                <Sparkles className="animate-pulse" />
                Tap For The Magic!
                <Heart className="animate-pulse" fill="white" />
              </button>
            </motion.div>

          </motion.div>
        ) : (
          // ====================
          // STAGE 2: THE GRAND FINALE
          // ====================
          <motion.div 
            key="finale"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}
            className="fixed inset-0 flex items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-md z-0"></div>

            <div className="absolute inset-0 z-10 w-full h-full">
              {finaleImages.map((src, i) => (
                <FloatingImage key={i} src={src} delay={i * 1.2} />
              ))}
            </div>

            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, delay: 1 }}
              className="relative z-50 bg-white/90 p-8 md:p-12 rounded-3xl shadow-[0_0_50px_rgba(255,255,255,0.3)] text-center max-w-sm w-11/12 border-4 border-rose-400 backdrop-blur-md"
            >
              <motion.div 
                animate={{ rotate: [-5, 5] }}
                transition={{ repeat: Infinity, repeatType: "mirror", duration: 2 }}
                className="flex justify-center mb-4"
              >
                <Heart size={60} fill="#e11d48" className="text-rose-600 drop-shadow-lg" />
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-valentine text-rose-600 mb-4 leading-tight">
                Will you be my Valentine forever, Choco? 🥺💍
              </h1>
              <p className="text-rose-500 font-bubbly text-xl font-bold">
                love you more than anything! 💕😭😭
                Ab aapke birthday per milte hai 🥹
              </p>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}