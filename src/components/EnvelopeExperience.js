"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function EnvelopeExperience({ onComplete }) {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const triggerTransition = () => {
    if (showContent) return;
    setShowContent(true);

    // Smooth audio fade out to match cinematic visual fade
    if (videoRef.current) {
      let volume = videoRef.current.volume;
      const fadeOutInterval = setInterval(() => {
        if (volume > 0.05) {
          volume -= 0.05;
          if (videoRef.current) videoRef.current.volume = volume;
        } else {
          if (videoRef.current) {
            videoRef.current.volume = 0;
            videoRef.current.pause();
          }
          clearInterval(fadeOutInterval);
          setTimeout(() => {
            handleEnter();
          }, 2000);
        }
      }, 50); // Fades out over ~1 second
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current || showContent) return;
    const { currentTime, duration } = videoRef.current;

    if (duration > 0 && duration - currentTime <= 5) {
      triggerTransition();
    }
  };

  const handleSkip = (e) => {
    e.stopPropagation();
    triggerTransition();
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setIsVideoPlaying(true);
      }).catch(error => {
        console.error("Video playback failed:", error);
      });
    }
  };

  const handleEnter = () => {
    // Dispatch event to trigger music if allowed
    window.dispatchEvent(new CustomEvent('playBackgroundMusic'));

    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 1500); // Wait for exit animation
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.2, filter: "blur(20px)" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "var(--bg-dark)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          {/* Ambient cinematic glow behind envelope */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              width: "60vmin",
              height: "60vmin",
              background: "radial-gradient(circle, var(--purple-glow) 0%, transparent 70%)",
              borderRadius: "50%",
              filter: "blur(50px)",
              zIndex: 0,
            }}
          />

          <div style={{ position: "relative", zIndex: 1, perspective: "1000px" }}>
            {/* The Envelope */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transform: isOpen ? "translateY(90px)" : "translateY(0px)" }}
              transition={{ duration: 1, delay: 0.5 }}
              style={{
                width: "min(90vw, 440px)",
                height: "280px",
                backgroundColor: "var(--envelope-bg)",
                position: "relative",
                borderRadius: "8px",
                boxShadow: "0 20px 50px rgba(0,0,0,0.8), 0 0 0 1px var(--purple-glow)",
                cursor: isOpen ? "default" : "pointer",
                transformStyle: "preserve-3d",
                transition: "all 1s ease"
              }}
              onClick={!isOpen ? handleOpen : undefined}
            >
              {/* Envelope Flap (Top) */}
              <motion.div
                initial={{ rotateX: 0 }}
                animate={{ rotateX: isOpen ? 180 : 0, zIndex: isOpen ? 0 : 4 }}
                transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "160px",
                  backgroundColor: "var(--envelope-bg)",
                  clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                  transformOrigin: "top",
                  borderTop: "1px solid var(--purple-glow)",
                  boxShadow: isOpen ? "none" : "0 5px 10px rgba(0,0,0,0.3)",
                }}
              >
              </motion.div>

              {/* Paper Tape / Sticker Seal (Moved outside flap to avoid clipPath) */}
              <motion.div
                animate={{ opacity: isOpen ? 0 : 1 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: "absolute",
                  top: "160px",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: isOpen ? 3 : 5,
                  pointerEvents: isOpen ? "none" : "auto",
                }}
              >
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isOpen) handleOpen();
                  }}
                  animate={isOpen ? {} : (isMobile ? { y: 0 } : { y: [0, -6, 0] })}
                  transition={isOpen ? {} : (isMobile ? {} : {
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    default: { duration: 0.5, ease: "easeOut" }
                  })}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "#ffffff",
                    boxShadow: "0 12px 30px rgba(92, 37, 51, 0.3), 0 0 15px rgba(197, 160, 89, 0.15)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    width: "120px",
                    height: "50px",
                    backgroundColor: "#FDFBF7", // Soft cream / warm ivory
                    borderRadius: "8px", // Slightly rounded (not fully pill)
                    boxShadow: "0 8px 20px rgba(0,0,0,0.25)", // Soft shadow (not harsh)
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "var(--wine-accent)", // Subtle wine or burgundy accent
                    fontFamily: "var(--font-playfair)",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    cursor: "pointer",
                    border: "1px dashed rgba(92, 37, 51, 0.4)", // Light dashed or thin border
                    letterSpacing: "2px",
                    transition: "background-color 0.5s ease, box-shadow 0.5s ease",
                    outline: "none"
                  }}
                >
                  {lang === 'ar' ? 'افتح' : 'OPEN'}
                </motion.button>
              </motion.div>

              {/* Envelope Body (Bottom overlap) */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "var(--envelope-bg)",
                  clipPath: "polygon(0 100%, 50% 40%, 100% 100%, 100% 0, 0 0)",
                  borderBottom: "1px solid var(--purple-glow)",
                  zIndex: 3,
                  pointerEvents: "none"
                }}
              >
                <div style={{
                  position: "absolute",
                  bottom: 0, left: 0, width: "100%", height: "100%",
                  background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)",
                }} />
              </div>

              {/* The Inner Card sliding out */}
              <motion.div
                initial={{ y: 0, opacity: 0 }}
                animate={{
                  y: isOpen ? -80 : 0,
                  opacity: isOpen ? 1 : 0,
                  zIndex: isOpen ? 3 : 1,
                }}
                transition={{ duration: 1.2, delay: isOpen ? 0.6 : 0, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  bottom: "20px",
                  left: "5%",
                  width: "90%",
                  height: "420px",
                  backgroundColor: "#FDFBF7", // Soft Ivory
                  borderRadius: "8px",
                  boxShadow: "0 -10px 30px rgba(0,0,0,0.5)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  pointerEvents: isOpen ? "auto" : "none",
                  overflow: "hidden"
                }}
              >
                <div style={{
                  position: "absolute",
                  top: "10px", left: "10px", right: "10px", bottom: "10px",
                  border: "1px solid var(--wine-accent)",
                  borderRadius: "4px",
                  pointerEvents: "none",
                  zIndex: 2
                }} />

                <AnimatePresence mode="wait">
                  {!showContent ? (
                    <motion.div
                      key="video"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                      style={{
                        position: "absolute",
                        top: 0, left: 0, right: 0, bottom: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#000",
                        zIndex: 1
                      }}
                    >
                      <video
                        ref={videoRef}
                        src="/vid.mp4"
                        playsInline
                        preload="none"
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={triggerTransition}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />

                      {/* Skip Video Button */}
                      {isVideoPlaying && (
                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSkip}
                          style={{
                            position: "absolute",
                            bottom: "30px",
                            right: "30px",
                            padding: "0.6rem 1.5rem",
                            backgroundColor: "rgba(0, 0, 0, 0.61)",
                            color: "var(--gold-accent)",
                            border: "1px solid rgba(255, 235, 235, 0.61)",
                            borderRadius: "30px",
                            backdropFilter: "blur(5px)",
                            fontFamily: "var(--font-inter)",
                            fontSize: "0.85rem",
                            letterSpacing: "1px",
                            cursor: "pointer",
                            zIndex: 10,
                            textTransform: "uppercase"
                          }}
                        >
                          {lang === 'ar' ? 'تخطي' : 'Skip Video'}
                        </motion.button>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1 }}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        height: "100%",
                        padding: "3rem 1.5rem",
                        zIndex: 1,
                        boxSizing: "border-box"
                      }}
                    >
                      <p style={{
                        fontFamily: "'Amiri', 'Cairo', serif",
                        fontSize: "clamp(1.1rem, 4.5vw, 1.4rem)",
                        color: "var(--gold-accent)",
                        textAlign: "center",
                        direction: "rtl",
                        lineHeight: "1.8",
                        width: "100%",
                        textShadow: "0 1px 2px rgba(0,0,0,0.05)",
                        margin: "0"
                      }}>
                        "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا"
                      </p>

                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "1rem 0" }}>
                        <h1 style={{
                          fontFamily: "var(--font-playfair)",
                          fontSize: "clamp(2.2rem, 8vw, 3rem)",
                          color: "#10071f",
                          margin: "0 0 0.5rem",
                          lineHeight: "1.1"
                        }}>
                          {lang === 'ar' ? "أحمد" : "Ahmed"} <span style={{ display: "block", color: "var(--gold-accent)", fontStyle: "italic", fontSize: "clamp(1.5rem, 5vw, 2rem)" }}>&</span>

                          {lang === 'ar' ? "روان" : "Rawan"}
                        </h1>

                        <p style={{
                          fontFamily: "var(--font-inter)",
                          fontSize: "clamp(0.85rem, 3vw, 1rem)",
                          color: "#150a2b",
                          letterSpacing: "3px",
                          textTransform: "uppercase",
                          margin: "0"
                        }}>
                          {lang === 'ar' ? '٢٩ يونيو ٢٠٢٦' : 'June 29, 2026'}
                        </p>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleEnter}
                        style={{
                          padding: "0.8rem 2.2rem",
                          backgroundColor: "#10071f",
                          color: "var(--gold-accent)",
                          border: "none",
                          borderRadius: "30px",
                          fontFamily: "var(--font-inter)",
                          textTransform: "uppercase",
                          letterSpacing: "2px",
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
                          marginTop: "0.5rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem"
                        }}
                      >
                        {lang === 'ar' ? "بداية حكايتنا معكم" : "Start our story with you"}
                        {lang === 'ar' ? <ArrowBackIcon /> : <ArrowForwardIcon />}
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

            </motion.div>
          </div>
        </motion.div >
      )
      }
    </AnimatePresence >
  );
}
