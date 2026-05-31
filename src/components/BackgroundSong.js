"use client";
import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function BackgroundSong() {
  const { t } = useLanguage();
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/song2.mp3");
    audioRef.current.loop = true;

    // Attempt to autoplay
    audioRef.current.play().then(() => {
      setIsPlaying(false);
    }).catch(error => {
      // Autoplay was prevented
      console.log("Autoplay prevented. User interaction required.");
      setIsPlaying(false);
    });

    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  useEffect(() => {
    const handlePlayMusicEvent = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setIsMuted(false);
          audioRef.current.muted = false;
        }).catch(err => console.log("Playback failed via event", err));
      }
    };

    window.addEventListener('playBackgroundMusic', handlePlayMusicEvent);
    return () => window.removeEventListener('playBackgroundMusic', handlePlayMusicEvent);
  }, []);

  const toggleMute = () => {
    if (!isPlaying) {
      audioRef.current.play();
      setIsPlaying(true);
      setIsMuted(false);
      audioRef.current.muted = false;
    } else {
      const nextMuted = !isMuted;
      setIsMuted(nextMuted);
      audioRef.current.muted = nextMuted;
    }
  };

  return (
    <button
      onClick={toggleMute}
      style={{
        position: 'fixed',
        bottom: '30px',
        left: '30px',
        zIndex: 100,
        background: 'rgba(10, 10, 10, 0.8)',
        color: 'var(--gold-accent, #D4AF37)',
        border: '1px solid rgba(212, 175, 55, 0.4)',
        borderRadius: '50%',
        width: '56px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.background = 'rgba(20, 20, 20, 0.9)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.background = 'rgba(10, 10, 10, 0.8)';
      }}
      aria-label={isMuted || !isPlaying ? t('playUnmute') : t('mute')}
      title={isMuted || !isPlaying ? t('playBgMusic') : t('muteBgMusic')}
    >
      {isMuted || !isPlaying ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
      )}
    </button>
  );
}
