'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Headphones,
  Battery,
  AudioLines,
  VolumeX,
  Menu,
  X,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  Maximize,
  ArrowUp,
} from 'lucide-react';

/* ──────────────────── Animated Section Wrapper ──────────────────── */
function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ──────────────────── Feature Card ──────────────────── */
function FeatureCard({
  icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}) {
  return (
    <AnimatedSection delay={delay}>
      <div className="feature-card group relative bg-[#1E293B] border border-[#334155] rounded-xl p-6 md:p-8 flex flex-col items-center text-center gap-4 overflow-hidden">
        {/* Glow overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#06B6D4]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {/* Icon */}
        <div className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#06B6D4]/15 border border-[#06B6D4]/30 aura-pulse">
          <div className="text-[#06B6D4]">{icon}</div>
        </div>
        {/* Title */}
        <h3 className="relative text-xl md:text-2xl font-bold text-[#F8FAFC]">{title}</h3>
        {/* Description */}
        <p className="relative text-[#94A3B8] text-sm md:text-base leading-relaxed max-w-xs">{description}</p>
      </div>
    </AnimatedSection>
  );
}

/* ──────────────────── Video Player with Controls ──────────────────── */
function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onLoadedMetadata = () => setDuration(video.duration);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const vol = parseFloat(e.target.value);
    video.volume = vol;
    setVolume(vol);
    if (vol === 0) {
      setIsMuted(true);
      video.muted = true;
    } else if (isMuted) {
      setIsMuted(false);
      video.muted = false;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const time = parseFloat(e.target.value);
    video.currentTime = time;
    setCurrentTime(time);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      className="video-wrapper relative w-full"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video 
  controls 
  playsInline 
  style={{ width: '100%', borderRadius: '12px', maxHeight: '450px' }}
  poster="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80"
>
  <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

      {/* Center play button overlay */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl transition-opacity duration-300 cursor-pointer"
          aria-label="Play video"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#06B6D4]/90 flex items-center justify-center shadow-lg shadow-[#06B6D4]/30">
            <Play className="w-8 h-8 md:w-10 md:h-10 text-[#0F172A] fill-[#0F172A]" />
          </div>
        </button>
      )}

      {/* Custom controls bar */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0F172A]/95 to-transparent p-4 pt-10 rounded-b-xl"
          >
            {/* Seek bar */}
            <div className="mb-3">
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-[#334155] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#06B6D4] [&::-webkit-slider-thumb]:shadow-[0_0_6px_rgba(6,182,212,0.5)]"
                aria-label="Seek video"
              />
              <div className="flex justify-between text-xs text-[#94A3B8] mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#06B6D4]/20 hover:bg-[#06B6D4]/40 transition-colors cursor-pointer"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-[#06B6D4]" />
                ) : (
                  <Play className="w-5 h-5 text-[#06B6D4] fill-[#06B6D4]" />
                )}
              </button>

              <button
                onClick={toggleMute}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#334155]/50 hover:bg-[#334155]/80 transition-colors cursor-pointer"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-[#94A3B8]" />
                ) : (
                  <Volume2 className="w-5 h-5 text-[#94A3B8]" />
                )}
              </button>

              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-[#334155] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#06B6D4]"
                aria-label="Volume"
              />

              <button
                onClick={toggleFullscreen}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#334155]/50 hover:bg-[#334155]/80 transition-colors ml-auto cursor-pointer"
                aria-label="Fullscreen"
              >
                <Maximize className="w-5 h-5 text-[#94A3B8]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ──────────────────── Main Page Component ──────────────────── */
export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Experience', href: '#experience' },
    { label: 'Technology', href: '#technology' },
    { label: 'Order Now', href: '#order' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0F172A] text-[#F8FAFC] font-[family-name:var(--font-inter)]">
      {/* ──────────── Sticky Navigation ──────────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0F172A]/95 backdrop-blur-md border-b border-[#334155]/50 shadow-lg shadow-[#06B6D4]/5'
            : 'bg-[#0F172A]/80 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-[#06B6D4]/20 border border-[#06B6D4]/40 flex items-center justify-center group-hover:bg-[#06B6D4]/40 transition-colors">
                <Headphones className="w-5 h-5 md:w-5 md:h-5 text-[#06B6D4]" />
              </div>
              <span className="text-xl md:text-2xl font-bold tracking-tight">
                <span className="text-[#06B6D4]">Aura</span>
                <span className="text-[#F8FAFC] ml-1">Audio</span>
              </span>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="nav-link text-[#94A3B8] hover:text-[#06B6D4] text-sm font-medium tracking-wide uppercase"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-[#334155]/50 hover:bg-[#334155] transition-colors cursor-pointer"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[#06B6D4]" />
              ) : (
                <Menu className="w-5 h-5 text-[#94A3B8]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-[#0F172A]/98 backdrop-blur-md border-b border-[#334155]/50"
            >
              <div className="px-4 py-4 flex flex-col gap-3">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[#94A3B8] hover:text-[#06B6D4] text-base font-medium py-2 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ──────────── Hero Section ──────────── */}
      <section id="hero" className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#06B6D4]/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#06B6D4]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Hero Text */}
            <div className="order-2 lg:order-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="inline-block text-[#06B6D4] text-sm md:text-base font-medium tracking-widest uppercase mb-4 border border-[#06B6D4]/30 rounded-full px-4 py-1.5">
                  Luxury Smart Headphones
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6"
              >
                <span className="text-[#F8FAFC]">Silence the World.</span>
                <br />
                <span className="text-[#06B6D4]">Awaken the Sound.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-[#94A3B8] text-lg md:text-xl leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0"
              >
                Experience audio perfection with Aura Pro X1 — featuring Adaptive Noise
                Cancelling, 40-hour marathon battery, and breathtaking Spatial Audio that
                transforms every moment into an immersive soundstage.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <a
                  href="#order"
                  className="cta-button inline-flex items-center justify-center gap-2 bg-[#06B6D4] text-[#0F172A] font-bold px-8 py-4 rounded-xl text-lg shadow-lg shadow-[#06B6D4]/25 hover:shadow-[#06B6D4]/40"
                >
                  Order Now
                  <ChevronRight className="w-5 h-5" />
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 bg-[#334155] border border-[#475569] text-[#F8FAFC] font-medium px-8 py-4 rounded-xl text-lg hover:bg-[#475569] hover:border-[#06B6D4]/50 transition-all duration-300"
                >
                  Explore Features
                </a>
              </motion.div>
            </div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="order-1 lg:order-2 flex items-center justify-center"
            >
              <div className="relative aura-float">
                {/* Glow ring behind image */}
                <div className="absolute inset-0 rounded-2xl bg-[#06B6D4]/20 blur-2xl scale-105" />
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80"
                  alt="Aura Audio premium headphones — modern, sleek design with superior sound quality"
                  className="relative w-full max-w-md lg:max-w-lg rounded-2xl object-cover shadow-2xl shadow-[#06B6D4]/20 border border-[#334155]/50"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ──────────── Features Section ──────────── */}
      <section id="features" className="relative py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12 md:mb-16">
              <span className="inline-block text-[#06B6D4] text-sm font-medium tracking-widest uppercase mb-4">
                Why Choose Aura
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Engineered for <span className="text-[#06B6D4]">Perfection</span>
              </h2>
              <p className="text-[#94A3B8] text-lg md:text-xl max-w-2xl mx-auto">
                Three breakthrough technologies that redefine what headphones can do.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard
              icon={<VolumeX className="w-7 h-7 md:w-8 md:h-8" />}
              title="Adaptive ANC"
              description="AI-powered noise cancellation that adapts to your environment in real-time. From bustling airports to quiet libraries — perfect silence, everywhere."
              delay={0.1}
            />
            <FeatureCard
              icon={<Battery className="w-7 h-7 md:w-8 md:h-8" />}
              title="40-Hour Battery"
              description="Marathon-grade stamina that powers through your longest days. Fast-charge 10 minutes for 5 hours — never miss a beat."
              delay={0.2}
            />
            <FeatureCard
              icon={<AudioLines className="w-7 h-7 md:w-8 md:h-8" />}
              title="Spatial Audio"
              description="360° immersive soundscapes that place you inside the music. Cinema-grade surround sound that transforms every track into a live performance."
              delay={0.3}
            />
          </div>

          {/* Product Feature Image */}
          <AnimatedSection delay={0.4}>
            <div className="mt-12 md:mt-16 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-[#06B6D4]/5 rounded-2xl blur-xl" />
              <img
                src="https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80"
                alt="Aura Audio headphones — close-up detail showing premium texture and craftsmanship"
                className="relative w-full max-w-2xl rounded-2xl object-cover shadow-xl shadow-[#06B6D4]/10 border border-[#334155]/50"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ──────────── Technology Section ──────────── */}
      <section id="technology" className="relative py-20 md:py-28">
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-[300px] h-[600px] bg-[#06B6D4]/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12 md:mb-16">
              <span className="inline-block text-[#06B6D4] text-sm font-medium tracking-widest uppercase mb-4">
                Inside the Craft
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Built with <span className="text-[#06B6D4]">Precision</span>
              </h2>
              <p className="text-[#94A3B8] text-lg md:text-xl max-w-2xl mx-auto">
                Every component is meticulously engineered for audio supremacy.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <AnimatedSection delay={0.1}>
              <div className="feature-card group bg-[#1E293B] border border-[#334155] rounded-xl p-6 md:p-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#06B6D4]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <h3 className="text-xl md:text-2xl font-bold text-[#F8FAFC] mb-3 relative">
                  50mm Bio-Cellulose Drivers
                </h3>
                <p className="text-[#94A3B8] text-sm md:text-base leading-relaxed relative">
                  Custom-engineered drivers deliver unmatched frequency response from 4Hz–40kHz.
                  Bio-cellulose diaphragms ensure crystal clarity across every octave — from sub-bass rumble
                  to ethereal highs.
                </p>
                <div className="mt-4 flex items-center gap-2 relative">
                  <span className="text-[#06B6D4] font-mono text-sm">4Hz – 40kHz</span>
                  <span className="text-[#94A3B8] text-sm">Frequency Range</span>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="feature-card group bg-[#1E293B] border border-[#334155] rounded-xl p-6 md:p-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#06B6D4]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <h3 className="text-xl md:text-2xl font-bold text-[#F8FAFC] mb-3 relative">
                  Qualcomm QCC5141 Chipset
                </h3>
                <p className="text-[#94A3B8] text-sm md:text-base leading-relaxed relative">
                  The neural engine behind Aura. Processes 48 million audio computations per second
                  for real-time ANC adaptation, spatial rendering, and lossless Bluetooth 5.3 streaming.
                </p>
                <div className="mt-4 flex items-center gap-2 relative">
                  <span className="text-[#06B6D4] font-mono text-sm">48M ops/sec</span>
                  <span className="text-[#94A3B8] text-sm">Processing Power</span>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="feature-card group bg-[#1E293B] border border-[#334155] rounded-xl p-6 md:p-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#06B6D4]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <h3 className="text-xl md:text-2xl font-bold text-[#F8FAFC] mb-3 relative">
                  Memory Foam Cushions
                </h3>
                <p className="text-[#94A3B8] text-sm md:text-base leading-relaxed relative">
                  Adaptive memory foam that contours to your unique ear shape. Cooling gel layer prevents
                  heat buildup during extended sessions. Ultra-soft protein leather for all-day comfort.
                </p>
                <div className="mt-4 flex items-center gap-2 relative">
                  <span className="text-[#06B6D4] font-mono text-sm">Protein Leather</span>
                  <span className="text-[#94A3B8] text-sm">Premium Material</span>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <div className="feature-card group bg-[#1E293B] border border-[#334155] rounded-xl p-6 md:p-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#06B6D4]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <h3 className="text-xl md:text-2xl font-bold text-[#F8FAFC] mb-3 relative">
                  Multi-Device Connectivity
                </h3>
                <p className="text-[#94A3B8] text-sm md:text-base leading-relaxed relative">
                  Simultaneously connect to 3 devices with seamless auto-switching. Phone call interrupts
                  your laptop music — Aura transitions instantly without missing a word.
                </p>
                <div className="mt-4 flex items-center gap-2 relative">
                  <span className="text-[#06B6D4] font-mono text-sm">3 Devices</span>
                  <span className="text-[#94A3B8] text-sm">Simultaneous Connection</span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ──────────── Video Experience Section ──────────── */}
      <section id="experience" className="relative py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12 md:mb-16">
              <span className="inline-block text-[#06B6D4] text-sm font-medium tracking-widest uppercase mb-4">
                See It In Action
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Experience <span className="text-[#06B6D4]">Aura</span>
              </h2>
              <p className="text-[#94A3B8] text-lg md:text-xl max-w-2xl mx-auto">
                Watch how Aura Pro X1 transforms your everyday moments into extraordinary soundscapes.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="max-w-4xl mx-auto">
              <VideoPlayer />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <div className="mt-12 md:mt-16 grid sm:grid-cols-3 gap-6 text-center">
              <div className="bg-[#1E293B]/50 border border-[#334155]/30 rounded-xl p-6">
                <div className="text-[#06B6D4] text-3xl md:text-4xl font-bold mb-2">4.9★</div>
                <div className="text-[#94A3B8] text-sm md:text-base">Average Rating</div>
              </div>
              <div className="bg-[#1E293B]/50 border border-[#334155]/30 rounded-xl p-6">
                <div className="text-[#06B6D4] text-3xl md:text-4xl font-bold mb-2">50K+</div>
                <div className="text-[#94A3B8] text-sm md:text-base">Units Sold</div>
              </div>
              <div className="bg-[#1E293B]/50 border border-[#334155]/30 rounded-xl p-6">
                <div className="text-[#06B6D4] text-3xl md:text-4xl font-bold mb-2">12</div>
                <div className="text-[#94A3B8] text-sm md:text-base">Design Awards</div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ──────────── Order / CTA Section ──────────── */}
      <section id="order" className="relative py-20 md:py-28 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#06B6D4]/10 rounded-full blur-[200px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="relative bg-[#1E293B] border border-[#06B6D4]/30 rounded-2xl p-8 md:p-12 lg:p-16 text-center overflow-hidden">
              {/* Decorative gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#06B6D4] to-transparent" />

              <span className="inline-block text-[#06B6D4] text-sm font-medium tracking-widest uppercase mb-4">
                Limited Edition Available
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Own the <span className="text-[#06B6D4]">Future</span> of Sound
              </h2>
              <p className="text-[#94A3B8] text-lg md:text-xl max-w-2xl mx-auto mb-8">
                Aura Pro X1 — now available in Midnight Black and Arctic Silver.
                Early adopters receive a complimentary premium carrying case and 2-year extended warranty.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="#"
                  className="cta-button inline-flex items-center justify-center gap-2 bg-[#06B6D4] text-[#0F172A] font-bold px-10 py-5 rounded-xl text-lg shadow-lg shadow-[#06B6D4]/25"
                >
                  Pre-Order — $349
                  <ChevronRight className="w-5 h-5" />
                </a>
                <span className="text-[#94A3B8] text-sm">Free shipping worldwide • 30-day return guarantee</span>
              </div>

              <div className="mt-8 flex items-center justify-center gap-6 text-[#94A3B8] text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#06B6D4]/20 border border-[#06B6D4]/40" />
                  Midnight Black
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#94A3B8]/20 border border-[#94A3B8]/40" />
                  Arctic Silver
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ──────────── Footer ──────────── */}
      <footer className="mt-auto bg-[#0F172A] border-t border-[#334155]/50 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#06B6D4]/20 border border-[#06B6D4]/40 flex items-center justify-center">
                  <Headphones className="w-5 h-5 text-[#06B6D4]" />
                </div>
                <span className="text-xl font-bold tracking-tight">
                  <span className="text-[#06B6D4]">Aura</span>
                  <span className="text-[#F8FAFC] ml-1">Audio</span>
                </span>
              </div>
              <p className="text-[#94A3B8] text-sm leading-relaxed">
                Luxury smart headphones crafted for audiophiles who demand perfection.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-[#F8FAFC] font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-[#94A3B8] hover:text-[#06B6D4] text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-[#F8FAFC] font-semibold text-sm uppercase tracking-wider mb-4">Support</h4>
              <nav className="flex flex-col gap-2">
                <a href="#" className="text-[#94A3B8] hover:text-[#06B6D4] text-sm transition-colors">Help Center</a>
                <a href="#" className="text-[#94A3B8] hover:text-[#06B6D4] text-sm transition-colors">Warranty Info</a>
                <a href="#" className="text-[#94A3B8] hover:text-[#06B6D4] text-sm transition-colors">Returns & Shipping</a>
                <a href="#" className="text-[#94A3B8] hover:text-[#06B6D4] text-sm transition-colors">Contact Us</a>
              </nav>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-[#F8FAFC] font-semibold text-sm uppercase tracking-wider mb-4">Legal</h4>
              <nav className="flex flex-col gap-2">
                <a href="#" className="text-[#94A3B8] hover:text-[#06B6D4] text-sm transition-colors">Privacy Policy</a>
                <a href="#" className="text-[#94A3B8] hover:text-[#06B6D4] text-sm transition-colors">Terms of Service</a>
                <a href="#" className="text-[#94A3B8] hover:text-[#06B6D4] text-sm transition-colors">Cookie Policy</a>
              </nav>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-[#334155]/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#94A3B8] text-sm">
              © {new Date().getFullYear()} Aura Audio. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-[#94A3B8] hover:text-[#06B6D4] text-sm transition-colors" aria-label="Twitter">
                Twitter
              </a>
              <a href="#" className="text-[#94A3B8] hover:text-[#06B6D4] text-sm transition-colors" aria-label="Instagram">
                Instagram
              </a>
              <a href="#" className="text-[#94A3B8] hover:text-[#06B6D4] text-sm transition-colors" aria-label="YouTube">
                YouTube
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ──────────── Back to Top Button ──────────── */}
      <AnimatePresence>
        {scrolled && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-[#06B6D4] text-[#0F172A] flex items-center justify-center shadow-lg shadow-[#06B6D4]/30 hover:shadow-[#06B6D4]/50 transition-shadow cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
