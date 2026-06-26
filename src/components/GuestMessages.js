"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CanvasDraw from './CanvasDraw';
import GroomDashboard from './GroomDashboard';
import { saveMessage, getMessages } from '../services/firebaseService';
import { useLanguage } from '../context/LanguageContext';

const DrawingViewer = ({ dataUrl }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (dataUrl && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, 300, 150);
        ctx.drawImage(img, 0, 0);
      };
      img.src = dataUrl;
    }
  }, [dataUrl]);
  return <canvas ref={canvasRef} width={300} height={150} style={{ width: '100%', height: 'auto', borderRadius: '4px', filter: 'drop-shadow(0 0 5px var(--gold-glow))' }} />
};

export default function GuestMessages() {
  const { t, lang } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [drawing, setDrawing] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const MESSAGES_PER_PAGE = 4;

  // Groom Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMessages();
    const auth = sessionStorage.getItem('groom_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const fetchMessages = async () => {
    const res = await getMessages();
    if (res.success) {
      setMessages(res.data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || (!text && !drawing)) return;
    setIsSubmitting(true);
    const res = await saveMessage(name, text, drawing);
    if (res.success) {
      setName('');
      setText('');
      setDrawing(null);
      setShowCanvas(false);
      fetchMessages();
      setCurrentPage(1); // Reset to first page to see new message
    }
    setIsSubmitting(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === '2410') {
      setIsAuthenticated(true);
      setIsModalOpen(false);
      setPassword('');
      setError('');
      sessionStorage.setItem('groom_auth', 'true');
    } else {
      setError(t('incorrectPassword'));
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('groom_auth');
    setIsDashboardOpen(false);
  };

  // Pagination Calculations
  const indexOfLastMessage = currentPage * MESSAGES_PER_PAGE;
  const indexOfFirstMessage = indexOfLastMessage - MESSAGES_PER_PAGE;
  const currentMessages = messages.slice(indexOfFirstMessage, indexOfLastMessage);
  const totalPages = Math.ceil(messages.length / MESSAGES_PER_PAGE);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Smooth scroll to messages top
    const messagesElement = document.getElementById('messages-list');
    if (messagesElement) {
      messagesElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.div
      className="section-container"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1 }}
      style={{ position: 'relative' }}
    >
      <div style={{
        position: 'absolute',
        top: '2rem',
        right: lang === 'ar' ? 'auto' : '2rem',
        left: lang === 'ar' ? '2rem' : 'auto',
        zIndex: 10,
        display: 'flex',
        gap: '0.5rem'
      }}>
        {!isAuthenticated ? (
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--ivory-highlight)',
              color: 'var(--text-secondary)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(5px)'
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--gold-accent)'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--ivory-highlight)'}
          >
            <span style={{ fontSize: '1rem' }}>🔒</span> {t('groomAccess')}
          </button>
        ) : (
          <>
            <button
              onClick={() => setIsDashboardOpen(true)}
              style={{
                background: 'rgba(197, 160, 89, 0.1)',
                border: '1px solid var(--gold-accent)',
                color: 'var(--gold-accent)',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
            >
              <span style={{ fontSize: '1rem' }}>📊</span> {t('dashboard')}
            </button>
            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(92, 37, 51, 0.2)',
                border: '1px solid var(--wine-accent)',
                color: 'var(--text-primary)',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
            >
              <span style={{ fontSize: '1rem' }}>🔓</span> {t('lockMessages')}
            </button>
          </>
        )}
      </div>

      <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
        {t('wordsOfLove')}
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', textAlign: 'center', maxWidth: '600px' }}>
        {t('guestbookDesc')}
      </p>

      <div className="glass-card" style={{ width: '100%', maxWidth: '600px', marginBottom: '4rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <input
            type="text"
            placeholder={t('yourName')}
            className="input-dark"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {!showCanvas ? (
            <>
              <textarea
                placeholder={t('writeMessage')}
                className="input-dark"
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ resize: 'none' }}
              />
              <button type="button" onClick={() => setShowCanvas(true)} style={{ background: 'none', border: 'none', color: 'var(--gold-accent)', cursor: 'pointer', textDecoration: 'underline', marginBottom: '1rem', alignSelf: 'flex-start', fontFamily: 'var(--font-inter)' }}>
                {t('switchToHandwritten')}
              </button>
            </>
          ) : (
            <div style={{ marginBottom: '1rem' }}>
              <CanvasDraw onSave={(dataUrl) => setDrawing(dataUrl)} onClear={() => setDrawing(null)} />
              {drawing && <p style={{ color: 'var(--gold-accent)', fontSize: '0.8rem', textAlign: 'center', marginTop: '0.5rem' }}>{t('drawingReady')}</p>}
              <button type="button" onClick={() => { setShowCanvas(false); setDrawing(null); }} style={{ background: 'none', border: 'none', color: 'var(--gold-accent)', cursor: 'pointer', textDecoration: 'underline', alignSelf: 'flex-start', marginTop: '1rem', fontFamily: 'var(--font-inter)' }}>
                {t('switchToTyped')}
              </button>
            </div>
          )}

          <button type="submit" className="btn-gold" disabled={isSubmitting || (!name || (!text && !drawing))}>
            {isSubmitting ? t('sending') : t('sendMessage')}
          </button>
        </form>
      </div>

      <div id="messages-list" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%', maxWidth: '800px', position: 'relative' }}>
        <AnimatePresence mode="wait">
          {messages.length > 0 ? (
            <motion.div
              key={`${isAuthenticated ? 'unlocked' : 'locked'}-${currentPage}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}
            >
              {currentMessages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass-card"
                  style={{
                    padding: '1.5rem',
                    alignSelf: idx % 2 === 0 ? 'flex-start' : 'flex-end',
                    width: '80%',
                    filter: isAuthenticated ? 'none' : 'blur(8px)',
                    opacity: isAuthenticated ? 1 : 0.4,
                    transition: 'filter 0.8s ease, opacity 0.8s ease',
                    userSelect: isAuthenticated ? 'auto' : 'none',
                    pointerEvents: isAuthenticated ? 'auto' : 'none'
                  }}
                >
                  <h4 style={{ color: 'var(--gold-accent)', marginBottom: '0.5rem', fontFamily: 'var(--font-playfair)', fontSize: '1.2rem' }}>{msg.name}</h4>
                  {msg.text && <p style={{ color: 'var(--text-primary)', lineHeight: 1.5 }}>{msg.text}</p>}
                  {msg.drawing && (
                    <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '8px', padding: '1rem', marginTop: '1rem' }}>
                      <DrawingViewer dataUrl={msg.drawing} />
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            marginTop: '3rem',
            padding: '1rem',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                background: 'none',
                border: 'none',
                color: currentPage === 1 ? 'rgba(253, 251, 247, 0.2)' : 'var(--gold-accent)',
                cursor: currentPage === 1 ? 'default' : 'pointer',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease'
              }}
            >
              {lang === 'ar' ? '→' : '←'} {t('prev')}
            </button>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  style={{
                    width: '35px',
                    height: '35px',
                    borderRadius: '50%',
                    border: '1px solid',
                    borderColor: currentPage === i + 1 ? 'var(--gold-accent)' : 'var(--ivory-highlight)',
                    background: currentPage === i + 1 ? 'rgba(197, 160, 89, 0.1)' : 'transparent',
                    color: currentPage === i + 1 ? 'var(--gold-accent)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-playfair)',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                background: 'none',
                border: 'none',
                color: currentPage === totalPages ? 'rgba(253, 251, 247, 0.2)' : 'var(--gold-accent)',
                cursor: currentPage === totalPages ? 'default' : 'pointer',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease'
              }}
            >
              {t('next')} {lang === 'ar' ? '←' : '→'}
            </button>
          </div>
        )}

        {!isAuthenticated && messages.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            zIndex: 5,
            width: '100%',
            padding: '2rem',
            pointerEvents: 'none' // Allow clicking pagination buttons if they overlap visually (unlikely but safe)
          }}>
            <div style={{ pointerEvents: 'auto' }}>
              <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                {t('lockedStateMsg')}
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-gold"
                style={{ fontSize: '0.9rem', padding: '0.6rem 2rem' }}
              >
                {t('unlockMessages')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Groom Login Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(10, 4, 20, 0.9)',
              backdropFilter: 'blur(10px)',
              zIndex: 10000,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '2rem'
            }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="glass-card"
              style={{ width: '100%', maxWidth: '400px', textAlign: 'center', padding: '3rem 2rem' }}
              onClick={(e) => e.stopPropagation()}
            >
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🤵</span>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', fontFamily: 'var(--font-playfair)' }}>{t('areYouGroom')}</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>{t('enterPassword')}</p>

              <form onSubmit={handleLogin}>
                <input
                  type="password"
                  className="input-dark"
                  style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '4px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                  required
                />
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ color: '#ff4d4d', fontSize: '0.85rem', marginTop: '-0.5rem', marginBottom: '1rem' }}
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
                <button type="submit" className="btn-gold" style={{ width: '100%' }}>
                  {t('unlockMessages')}
                </button>
              </form>

              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', marginTop: '1.5rem', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <GroomDashboard isOpen={isDashboardOpen} onClose={() => setIsDashboardOpen(false)} />
    </motion.div>
  );
}
