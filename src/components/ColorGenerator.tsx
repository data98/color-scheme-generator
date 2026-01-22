'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Copy, Check, Download, Palette, Wand2 } from 'lucide-react';
import { fetchColorScheme, getRandomHex, SchemeResponse, ColorSchemeMode, ColorResponse } from '@/lib/api';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

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
    const [seedColor, setSeedColor] = useState('#6366F1');
    const [mode, setMode] = useState<ColorSchemeMode>('analogic');
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
        <div className="min-h-screen p-4 md:p-8 flex flex-col items-center max-w-6xl mx-auto">
            <header className="text-center mb-12 space-y-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 12 }}
                    className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-full text-indigo-600 dark:text-indigo-400 font-medium"
                >
                    <Palette className="w-5 h-5" />
                    <span>Chroma Fun</span>
                </motion.div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white">
                    Color Scheme <span className="text-indigo-600">Generator</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                    Create beautiful, modern, and playful color palettes effortlessly using The Color API.
                </p>
            </header>

            <section className="w-full glass rounded-3xl p-6 mb-8 flex flex-wrap gap-4 items-end justify-center">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Seed Color</label>
                    <div className="flex gap-2">
                        <input
                            type="color"
                            value={seedColor}
                            onChange={(e) => setSeedColor(e.target.value.toUpperCase())}
                            className="w-12 h-12 rounded-lg cursor-pointer border-none bg-transparent"
                        />
                        <input
                            type="text"
                            value={seedColor}
                            onChange={(e) => setSeedColor(e.target.value.toUpperCase())}
                            onFocus={(e) => e.target.select()}
                            placeholder="#000000"
                            className="bg-white dark:bg-slate-800 border-none rounded-xl px-4 py-2 w-32 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-2 flex-1 min-w-[200px]">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Mode</label>
                    <select
                        value={mode}
                        onChange={(e) => setMode(e.target.value as ColorSchemeMode)}
                        className="w-full bg-white dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-[48px]"
                    >
                        {MODES.map((m) => (
                            <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => generateScheme()}
                        disabled={loading}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2 playful-hover active:scale-95"
                    >
                        {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                        Generate
                    </button>
                    <button
                        onClick={handleRandomize}
                        className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 p-3 rounded-xl transition-all playful-hover"
                        title="Randomize"
                    >
                        <RefreshCw className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                    </button>
                </div>
            </section>

            <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-4 h-auto md:h-[500px]">
                <AnimatePresence mode="popLayout" initial={false}>
                    {scheme?.colors.map((color, index) => (
                        <motion.div
                            key={`${color.hex.value}-${index}`}
                            layout
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{
                                type: 'spring',
                                damping: 20,
                                stiffness: 100,
                                delay: index * 0.05
                            }}
                            className="relative group cursor-pointer h-[200px] md:h-full"
                            onClick={() => copyToClipboard(color.hex.value, index)}
                        >
                            <div
                                className="w-full h-full rounded-2xl md:rounded-3xl shadow-lg flex flex-col items-center justify-end pb-8 group-hover:shadow-2xl transition-all duration-300 overflow-hidden"
                                style={{ backgroundColor: color.hex.value }}
                            >
                                <div className="bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full pointer-events-none mb-2 border border-white/10">
                                    <span className="text-white font-mono text-sm font-bold">{color.hex.value}</span>
                                </div>
                                <span className="text-white/80 text-xs font-bold uppercase tracking-widest">{color.name.value}</span>
                            </div>

                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-white/30 backdrop-blur-md p-4 rounded-full border border-white/20">
                                    {copiedIndex === index ? (
                                        <Check className="w-8 h-8 text-white drop-shadow-md" />
                                    ) : (
                                        <Copy className="w-8 h-8 text-white drop-shadow-md" />
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <footer className="mt-12 text-slate-400 text-sm font-medium flex gap-6">
                <span>Click any color to copy HEX</span>
                <span>•</span>
                <button className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    Export Palette
                </button>
            </footer>
        </div>
    );
}
