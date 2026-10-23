/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Volume2, VolumeX, Play, Sparkles } from 'lucide-react';
import { sound } from '../audio/soundManager';

interface TitleScreenProps {
  onStart: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart, isMuted, onToggleMute }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        onStart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStart]);

  return (
    <div className="absolute inset-0 flex flex-col justify-between p-8 sm:p-12 z-30 select-none bg-radial from-amber-950/20 via-black/40 to-black/80 pointer-events-auto">
      {/* Top Bar with Audio Settings */}
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-300/80">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Cozy Daycare Simulator</span>
        </div>
        <button
          onClick={onToggleMute}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-white/80 hover:text-white border border-white/10 text-xs transition-colors cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          <span>{isMuted ? 'Unmute' : 'Audio ON'}</span>
        </button>
      </div>

      {/* Hero Centerpiece & Title Lockup with 35% Negative Space */}
      <div className="flex flex-col items-center justify-center my-auto text-center max-w-2xl mx-auto">
        {/* Custom Inline SVG Brand Lockup */}
        <div className="mb-6 drop-shadow-xl flex flex-col items-center">
          <svg className="w-20 h-20 mb-2" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="50" cy="65" rx="22" ry="16" fill="#f59e0b" />
            <circle cx="28" cy="40" r="10" fill="#f59e0b" />
            <circle cx="42" cy="28" r="9" fill="#f59e0b" />
            <circle cx="58" cy="28" r="9" fill="#f59e0b" />
            <circle cx="72" cy="40" r="10" fill="#f59e0b" />
            <path d="M42 66C42 63 58 63 58 66C58 70 42 70 42 66Z" fill="#ffffff" />
          </svg>
          <h1 className="font-display font-black text-4xl sm:text-6xl tracking-tight text-white drop-shadow-md">
            HAPPY <span className="text-amber-400">PAWS</span>
          </h1>
          <p className="font-display font-medium text-lg sm:text-xl text-amber-200/90 tracking-wide mt-1">
            DOG DAYCARE RESORT
          </p>
        </div>

        <p className="text-sm sm:text-base text-stone-300 font-normal leading-relaxed max-w-lg mb-8">
          Welcome to your cozy dream resort! Care for adorable pups, serve gourmet kibble, 
          run bubble baths, toss tennis balls, and earn 5-star customer reviews.
        </p>

        {/* Primary Start CTA */}
        <button
          onClick={() => {
            sound.playClick();
            onStart();
          }}
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-display font-bold text-lg shadow-lg hover:shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Open Daycare Shift</span>
        </button>
      </div>

      {/* Flat Control-Hint Line as Required */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-stone-400 tracking-wide border-t border-white/10 pt-4 text-center">
        <span>WASD / Click Move</span>
        <span>·</span>
        <span>Space / Click Action</span>
        <span>·</span>
        <span>1-6 Select Tool</span>
        <span>·</span>
        <span>F Whistle</span>
        <span>·</span>
        <span>Esc Pause</span>
      </div>
    </div>
  );
};
