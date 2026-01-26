'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Copy, Check, Palette, Wand2, Github } from 'lucide-react';
import { fetchColorScheme, getRandomHex, SchemeResponse, ColorSchemeMode } from '@/lib/api';
import { HoverButton } from './ui/hover-glow-button';

const MODES: { value: ColorSchemeMode; label: string }[] = [
  { value: 'monochrome', label: 'Monochrome' },
  { value: 'monochrome-dark', label: 'Dark' },
  { value: 'monochrome-light', label: 'Light' },
  { value: 'analogic', label: 'Analogic' },
  { value: 'complement', label: 'Complement' },
  { value: 'analogic-complement', label: 'Analogic Comp' },
  { value: 'triad', label: 'Triad' },
  { value: 'quad', label: 'Quad' },
];

export default function ColorGenerator() {
  const [seedColor, setSeedColor] = useState('#4E42F9');
  const [mode, setMode] = useState<ColorSchemeMode>('monochrome');
  const [count, setCount] = useState(5);
  const [scheme, setScheme] = useState<SchemeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateScheme = async (color: string = seedColor) => {
    setLoading(true);
    try {
      const data = await fetchColorScheme(color, mode, count);
      setScheme(data);
    } catch (error) {
      console.error('Error fetching scheme:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRandomize = () => {
    const newColor = `#${getRandomHex()}`;
    setSeedColor(newColor);
    generateScheme(newColor);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  useEffect(() => {
    generateScheme();
  }, []);

  return (
    <div className="min-h-screen px-6 py-12 md:py-24 flex flex-col items-center max-w-7xl mx-auto relative z-10">
      <header className="text-center mb-16 space-y-6">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-center gap-2 text-[#5D53F4] text-sm font-bold tracking-[0.2em] uppercase"
        >
          <Palette className="w-4 h-4" />
          <span>Chroma Fun</span>
        </motion.div>

        <h1 className="text-6xl md:text-8xl font-normal leading-tight text-white max-w-4xl mx-auto">
          The color tool for
          <span className="italic"> designers.</span>
        </h1>

        <p className="text-[#646a85] text-lg md:text-xl max-w-xl mx-auto font-light leading-relaxed">
          Generate professional color palettes.
        </p>


      </header>

      <section className="w-full max-w-4xl bg-white/5 backdrop-blur-md rounded-lg p-2 mb-16 flex flex-wrap gap-2 items-stretch justify-center border border-white/10 shadow-2xl">
        <div className="flex items-center bg-[#151518] rounded-md px-4 py-2 flex-1 min-w-[200px] h-[52px] border border-white/5">
          <input
            type="color"
            value={seedColor}
            onChange={(e) => setSeedColor(e.target.value.toUpperCase())}
            className="w-8 h-8 rounded-sm cursor-pointer border-none bg-transparent mr-3"
          />
          <input
            type="text"
            value={seedColor}
            onChange={(e) => setSeedColor(e.target.value.toUpperCase())}
            onFocus={(e) => e.target.select()}
            className="bg-transparent border-none text-white font-mono text-sm tracking-widest focus:ring-0 outline-none w-full"
          />
        </div>

        <div className="flex-1 min-w-[180px] h-[52px]">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as ColorSchemeMode)}
            className="w-full h-full bg-[#151518] border border-white/5 rounded-md px-4 text-sm text-white focus:ring-1 focus:ring-[#4e42f9] outline-none appearance-none cursor-pointer"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23646a85\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em' }}
          >
            {MODES.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 flex-1 h-[52px]">
          <HoverButton
            onClick={() => generateScheme()}
            disabled={loading}
            className="cursor-pointer flex-1 md:w-[200px] text-md h-full"
            glowColor={seedColor}
            backgroundColor="#000"
            textColor="#ffffff"
            hoverTextColor="#ffffff"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            Generate
          </HoverButton>
          <button
            onClick={handleRandomize}
            className="cursor-pointer bg-[#151518] hover:bg-[#1c1c21] border border-white/5 p-3 h-full aspect-square rounded-md transition-all flex items-center justify-center"
            title="Randomize"
          >
            <RefreshCw className="w-4 h-4 text-white/70" />
          </button>
        </div>
      </section>

      <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-24">
        <AnimatePresence mode="popLayout" initial={false}>
          {scheme?.colors.map((color, index) => (
            <motion.div
              key={`${color.hex.value}-${index}`}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 120,
                delay: index * 0.04
              }}
              className="relative aspect-square sm:aspect-[3/4] group cursor-pointer"
              onClick={() => copyToClipboard(color.hex.value, index)}
            >
              <div
                className="w-full h-full rounded-md shadow-2xl flex flex-col items-center justify-end transition-all duration-500 group-hover:scale-[1.02]"
                style={{ backgroundColor: color.hex.value }}
              >
                <div className="w-full space-y-1 text-center bg-black/26 p-4 overflow-hidden rounded-b-md">
                  <span className="block text-white font-mono text-sm font-bold tracking-widest">{color.hex.value}</span>
                  <span className="block text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] leading-140%">{color.name.value}</span>
                </div>
              </div>

              <div className="absolute inset-0 flex items-start py-6 md:py-0 md:items-center justify-center md:opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="bg-white/10 backdrop-blur-xl p-6 rounded-full border border-white/20 scale-90 group-hover:scale-100 transition-transform">
                  {copiedIndex === index ? (
                    <Check className="w-4 h-4 text-white drop-shadow-lg" />
                  ) : (
                    <Copy className="w-4 h-4 text-white drop-shadow-lg" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <footer className="w-full pt-12 border-t border-white/5 flex flex-col md:flex-row justify-center items-center gap-2 text-[#646a85] text-xs font-medium tracking-widest uppercase">

        Built with ❤️ by <a href="https://github.com/data98" target="_blank" rel="noopener noreferrer" className="hover:text-[#4e42f9] transition-colors flex items-center gap-2">
          <Github className="w-3 h-3" /> Data
        </a>
      </footer>
    </div>
  );
}
