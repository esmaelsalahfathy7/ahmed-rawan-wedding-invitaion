"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

export default function Timeline() {
  const { lang, t } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);

  // Track the stack order of the 4 card indices. Top card is always stack[0]
  const [stack, setStack] = useState([0, 1, 2, 3]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cyclingCard, setCyclingCard] = useState(null); // Tracks card that is actively sliding to bottom

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Timeline events mapped strictly to the 4 core wedding images in public
  const timelineMilestones = [
    {
      src: "/far-look.png",
      date: lang === "ar" ? "١٤ يوليو ٢٠٢٣" : "July 14, 2023",
      title: lang === "ar" ? "اللقاء الأول" : "First Sight",
      desc: lang === "ar" ? "التقت أعيننا وتغير شيء عميق بالداخل، أدركت حينها أن قلبي قد وجد موطنه." : "Our eyes met, and in that fleeting moment, something profound shifted. My heart had found its home."
    },
    {
      src: "/engagment.png",
      date: lang === "ar" ? "٢٦ سبتمبر ٢٠٢٣" : "September 26, 2023",
      title: lang === "ar" ? "يوم الخطبة" : "Engagement Day",
      desc: lang === "ar" ? "تحت سماء مرصعة بالنجوم الشتوية، سؤال بسيط غيّر مجرى حياتنا ووعد قطعناه بدموع الفرح." : "Under a canopy of stars, a simple question changed everything. A sacred promise was made."
    },
    {
      src: "/marriage.png",
      date: lang === "ar" ? "٢٩ مايو ٢٠٢٥" : "May 29, 2025",
      title: lang === "ar" ? "عقد القران" : "Marriage Contract Ceremony",
      desc: lang === "ar" ? "في حضور الأهل والأصدقاء، احتفلنا بلحظة عابرة غيّرت كل شيء في حياتنا.. عقدنا قراننا، وعاهدنا الله أن تبقى قلوبنا واحدة ما دامت الحياة تنبض." : "In the presence of family and friends, we celebrated a pivotal moment that changed our lives forever.. We solemnized our marriage, promising God that our hearts would remain one as long as life beats."
    },
    {
      src: "/love-sign.png",
      date: lang === "ar" ? "٢٩ يونيو ٢٠٢٦" : "June 29, 2026",
      title: lang === "ar" ? "يوم الزفاف" : "Wedding Day",
      desc: lang === "ar" ? "اليوم الذي يصبح فيه طريقان رحلة واحدة. نسعد بتشريفكم لنا وبدء حياتنا المشتركة معاً." : "The day two paths become one beautiful journey. We cannot wait to celebrate this milestone with you."
    },
  ];

  const handleCardClick = (cardIndex) => {
    // Only allow interactions on the top active card
    if (stack[0] !== cardIndex || cyclingCard !== null) return;

    if (!isFlipped) {
      // First click: flip top card to reveal the back details
      setIsFlipped(true);
    } else {
      // Second click: Flip back to front and cycle to the bottom of the stack
      setCyclingCard(cardIndex);
      setIsFlipped(false);

      // We animate the card throwing out to the side, then shifting behind
      setTimeout(() => {
        setStack((prevStack) => {
          const newStack = [...prevStack];
          const first = newStack.shift();
          newStack.push(first);
          return newStack;
        });
        setCyclingCard(null);
      }, 500); // Matches the duration of the throw animation
    }
  };

  // Find the original chronological index of the current top card for the dots
  const activeDotIndex = stack[0];

  return (
    <section
      className="section-container"
      style={{
        padding: "8rem 2rem 8rem",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "var(--bg-darker)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      {/* Decorative Glows */}
      <div
        style={{
          position: "absolute",
          width: "450px",
          height: "450px",
          background: "radial-gradient(circle, rgba(138, 43, 226, 0.08) 0%, transparent 70%)",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          filter: "blur(60px)"
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{ textAlign: "center", marginBottom: "4.5rem", position: "relative", zIndex: 10 }}
      >
        <h2
          style={{
            fontSize: "2.8rem",
            color: "var(--gold-accent)",
            marginBottom: "1rem",
            fontFamily: "var(--font-playfair)"
          }}
        >
          {lang === "ar" ? "رحلة حبنا " : "Our Love Story"}
        </h2>
        <p
          style={{
            fontFamily: "var(--font-cairo)",
            color: "var(--text-secondary)",
            fontSize: "0.95rem",
            letterSpacing: lang === "ar" ? "0px" : "2px",
            textTransform: "uppercase"
          }}
        >
          {lang === "ar" ? "اضغط على البطاقة لعرض تفاصيلها ثم اسحبها للخلف" : "Tap card to flip, tap again to cycle to the bottom"}
        </p>
        <div style={{ width: "60px", height: "1px", background: "var(--gold-accent)", margin: "1.5rem auto 0", opacity: 0.5 }}></div>
      </motion.div>

      {/* Stack Deck Area */}
      <div
        style={{
          width: "100%",
          maxWidth: "340px",
          height: "420px",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          perspective: "1500px",
          zIndex: 5
        }}
      >
        {timelineMilestones.map((milestone, cardIndex) => {
          // Determine the position of this card in the active stack order
          const positionInStack = stack.indexOf(cardIndex);
          const isTopCard = positionInStack === 0;
          const isCycling = cyclingCard === cardIndex;

          // Define card offsets and rotations to show visual depth for stacked cards
          let xOffset = 0;
          let yOffset = 0;
          let rotateAngle = 0;
          let cardScale = 1.0;
          let opacityValue = 1.0;
          let zIndexValue = 10 - positionInStack;

          if (!isTopCard) {
            // Apply slight offsets for cards behind the top card
            if (positionInStack === 1) {
              xOffset = 10;
              yOffset = 12;
              rotateAngle = 3;
              cardScale = 0.96;
              opacityValue = 0.92;
            } else if (positionInStack === 2) {
              xOffset = -8;
              yOffset = 24;
              rotateAngle = -4;
              cardScale = 0.92;
              opacityValue = 0.82;
            } else if (positionInStack === 3) {
              xOffset = 12;
              yOffset = 36;
              rotateAngle = 5;
              cardScale = 0.88;
              opacityValue = 0.7;
            }
          }

          return (
            <motion.div
              key={cardIndex}
              animate={
                isCycling
                  ? {
                    x: lang === "ar" ? -340 : 340, // throw to left in Arabic, right in English
                    y: -20,
                    rotate: lang === "ar" ? -15 : 15,
                    scale: 0.95,
                    zIndex: 50,
                    opacity: 0.85
                  }
                  : {
                    x: xOffset,
                    y: yOffset,
                    rotate: rotateAngle,
                    scale: cardScale,
                    opacity: opacityValue,
                    zIndex: zIndexValue
                  }
              }
              transition={
                isCycling
                  ? { duration: 0.5, ease: [0.25, 1, 0.5, 1] } // Quick throw out
                  : { type: "spring", stiffness: 90, damping: 15 } // Snug spring back
              }
              style={{
                position: "absolute",
                width: "280px",
                height: "380px",
                cursor: isTopCard ? "pointer" : "default",
                transformStyle: "preserve-3d"
              }}
              onClick={() => handleCardClick(cardIndex)}
            >
              {/* Inner container to hold 3D Flip */}
              <motion.div
                animate={{ rotateY: isTopCard && isFlipped ? 180 : 0 }}
                transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  transformStyle: "preserve-3d",
                  borderRadius: "16px",
                  boxShadow: isTopCard
                    ? "0 20px 45px rgba(0,0,0,0.85), 0 0 20px rgba(197, 160, 89, 0.25)"
                    : "0 10px 25px rgba(0,0,0,0.6)"
                }}
              >
                {/* 1. FRONT SIDE OF THE CARD */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    borderRadius: "16px",
                    overflow: "hidden",
                    border: "2px solid rgba(253, 251, 247, 0.08)",
                    backgroundColor: "var(--bg-dark)",
                    pointerEvents: isTopCard ? "auto" : "none"
                  }}
                >
                  <img
                    src={milestone.src}
                    alt={milestone.title}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block"
                    }}
                  />
                  {/* Elegant Dark Vignette */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(10, 4, 20, 0.8) 0%, transparent 40%)",
                      pointerEvents: "none"
                    }}
                  />
                  {/* Floating Date Label */}
                  <div
                    style={{
                      position: "absolute",
                      top: "1.2rem",
                      right: "1.2rem",
                      backgroundColor: "rgba(10, 4, 20, 0.65)",
                      border: "1px solid rgba(197, 160, 89, 0.3)",
                      borderRadius: "20px",
                      padding: "0.3rem 0.8rem",
                      fontFamily: "var(--font-cairo)",
                      fontSize: "0.75rem",
                      color: "var(--gold-accent)",
                      backdropFilter: "blur(4px)"
                    }}
                  >
                    {milestone.date}
                  </div>
                  {/* Bottom Text Title */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "1.5rem",
                      left: 0,
                      right: 0,
                      textAlign: "center",
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-playfair)",
                      fontSize: "1.35rem",
                      fontWeight: 400,
                      textShadow: "0 2px 8px rgba(0,0,0,0.95)",
                      pointerEvents: "none"
                    }}
                  >
                    {milestone.title}
                  </div>
                </div>

                {/* 2. BACK SIDE OF THE CARD */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    borderRadius: "16px",
                    border: "2px solid var(--gold-accent)",
                    background: "radial-gradient(circle at center, #1b0f2e 0%, var(--bg-darker) 100%)",
                    padding: "2.5rem 1.8rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    textAlign: "center",
                    overflow: "hidden",
                    pointerEvents: isTopCard ? "auto" : "none"
                  }}
                >
                  {/* Dashed Border Decoration */}
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      bottom: "10px",
                      left: "10px",
                      right: "10px",
                      border: "1px dashed rgba(197, 160, 89, 0.25)",
                      borderRadius: "12px",
                      pointerEvents: "none"
                    }}
                  />

                  {/* Back Date */}
                  <span
                    style={{
                      fontFamily: "var(--font-cairo)",
                      color: "var(--gold-accent)",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      letterSpacing: "1px",
                      zIndex: 2
                    }}
                  >
                    {milestone.date}
                  </span>

                  {/* Story Text Wrapper */}
                  <div style={{ zIndex: 2, margin: "1rem 0" }}>
                    <h3
                      style={{
                        fontFamily: "var(--font-playfair)",
                        fontSize: "1.65rem",
                        color: "var(--text-primary)",
                        marginBottom: "0.75rem",
                        textShadow: "0 2px 10px rgba(0,0,0,0.5)"
                      }}
                    >
                      {milestone.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "var(--font-cairo)",
                        fontSize: "0.88rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.6,
                        padding: "0 0.2rem"
                      }}
                    >
                      {milestone.desc}
                    </p>
                  </div>

                  {/* Pulse heart icon at the bottom of back card */}
                  <motion.div
                    animate={isTopCard && isFlipped ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      color: "var(--gold-accent)",
                      fontSize: "1.5rem",
                      zIndex: 2
                    }}
                  >
                    ❦
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Dots Indicator */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.75rem",
          marginTop: "3rem",
          zIndex: 10,
          position: "relative"
        }}
      >
        {[0, 1, 2, 3].map((dotIndex) => {
          const isActive = activeDotIndex === dotIndex;
          return (
            <motion.div
              key={dotIndex}
              animate={{
                scale: isActive ? 1.3 : 1.0,
                backgroundColor: isActive ? "var(--gold-accent)" : "rgba(253, 251, 247, 0.2)"
              }}
              transition={{ duration: 0.3 }}
              style={{
                width: isActive ? "12px" : "8px",
                height: isActive ? "12px" : "8px",
                borderRadius: "50%",
                boxShadow: isActive ? "0 0 10px var(--gold-accent)" : "none",
                cursor: "pointer"
              }}
              onClick={() => {
                // If user clicks a dot directly, we cycle the stack to put that card on top!
                if (cyclingCard !== null) return;
                setIsFlipped(false);
                setStack((prev) => {
                  const targetIndex = prev.indexOf(dotIndex);
                  if (targetIndex === 0) return prev;
                  const newStack = [...prev];
                  // Cycle array elements until targetIndex is at index 0
                  for (let i = 0; i < targetIndex; i++) {
                    const shifted = newStack.shift();
                    newStack.push(shifted);
                  }
                  return newStack;
                });
              }}
            />
          );
        })}
      </div>
    </section>
  );
}
