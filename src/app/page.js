"use client";
import { useState, useEffect } from "react";
import EnvelopeExperience from "../components/EnvelopeExperience";
import WelcomeSection from "../components/WelcomeSection";
import LettersSection from "../components/LettersSection";
import RomanticMaze from "../components/RomanticMaze";
import Timeline from "../components/Timeline";
import Countdown from "../components/Countdown";
import Location from "../components/Location";
import GuestMessages from "../components/GuestMessages";
import RSVP from "../components/RSVP";
import PhotoUpload from "../components/PhotoUpload";
import BackgroundSong from "@/components/BackgroundSong";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useLanguage } from "../context/LanguageContext";

export default function Home() {
  const [isOpened, setIsOpened] = useState(false);
  const { t } = useLanguage();



  return (
    <main style={{ minHeight: "100vh", position: "relative" }}>
      <LanguageSwitcher />
      <BackgroundSong />
      {!isOpened && <EnvelopeExperience onComplete={() => setIsOpened(true)} />}

      {isOpened && (
        <div style={{ opacity: 1, animation: "fadeIn 2s ease-in-out" }}>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}</style>

          {/* Background ambient glow effects across the scrollable page */}
          <div
            className="cinematic-glow"
            style={{
              top: "10%",
              left: "-10%",
              width: "500px",
              height: "500px",
            }}
          ></div>
          <div
            className="cinematic-glow"
            style={{
              top: "40%",
              right: "-10%",
              width: "400px",
              height: "400px",
            }}
          ></div>
          <div
            className="cinematic-glow"
            style={{
              bottom: "10%",
              left: "20%",
              width: "600px",
              height: "600px",
              opacity: 0.5,
            }}
          ></div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <WelcomeSection />
            <LettersSection />
            <RomanticMaze />
            <Countdown />
            <Timeline />
            <Location />
            <GuestMessages />
            <RSVP />
            <PhotoUpload />

            <footer
              style={{
                padding: "4rem",
                textAlign: "center",
                color: "var(--text-secondary)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: "1.5rem",
                  letterSpacing: "2px",
                  color: "var(--gold-accent)",
                }}
              >
                {t('lookForward')}
              </p>
              <div
                style={{
                  width: "50px",
                  height: "1px",
                  background: "var(--gold-accent)",
                  margin: "2rem auto",
                  opacity: 0.5,
                }}
              ></div>
            </footer>
          </div>
        </div>
      )}
    </main>
  );
}
