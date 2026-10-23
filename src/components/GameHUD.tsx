/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Volume2,
  VolumeX,
  Pause,
  Sun,
  Coins,
  Star,
  Sparkles,
  Hand,
  CircleDot,
  Utensils,
  Bath,
  Trash2,
  Bone,
  Megaphone,
} from 'lucide-react';
import { Caretaker, DaycareStats, Dog, PoopMess } from '../types/game';
import { sound } from '../audio/soundManager';

interface GameHUDProps {
  stats: DaycareStats;
  caretaker: Caretaker;
  dogs: Dog[];
  poops: PoopMess[];
  isMuted: boolean;
  onToggleMute: () => void;
  onPause: () => void;
  onSelectTool: (tool: Caretaker['holdingItem']) => void;
  onWhistle: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  stats,
  caretaker,
  dogs,
  poops,
  isMuted,
  onToggleMute,
  onPause,
  onSelectTool,
  onWhistle,
}) => {
  // Convert timeOfDay (0 - 600) to 8:00 AM - 6:00 PM
  const totalMinutes = Math.floor(8 * 60 + (stats.timeOfDay / 600) * 10 * 60);
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 > 12 ? hours24 - 12 : hours24 === 0 ? 12 : hours24;
  const timeFormatted = `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  const dayProgressPct = Math.min(100, Math.round((stats.timeOfDay / 600) * 100));

  // Determine critical alerts
  const starvingDogs = dogs.filter((d) => d.needs.hunger < 35);
  const dirtyDogs = dogs.filter((d) => d.needs.cleanliness < 35 || d.isMuddy);
  const dirtyPoopCount = poops.filter((p) => !p.cleaned).length;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-6 z-10 select-none">
      {/* Top Perimeter Bar */}
      <div className="flex justify-between items-start w-full gap-4">
        {/* Left Status Cluster: Day & Clock */}
        <div className="pointer-events-auto flex items-center gap-3 bg-stone-900/90 border border-stone-700/60 rounded-xl px-4 py-2.5 shadow-md">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-300">
              <span>Day {stats.day}</span>
              <span className="text-stone-600">·</span>
              <span className="font-mono tabular-nums text-white">{timeFormatted}</span>
            </div>
            {/* Day Progress Mini Bar */}
            <div className="w-28 h-1.5 bg-stone-800 rounded-full overflow-hidden mt-1.5">
              <div
                className="h-full bg-amber-500 transition-all duration-300 rounded-full"
                style={{ width: `${dayProgressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center Urgent Needs Ticker */}
        {(starvingDogs.length > 0 || dirtyDogs.length > 0 || dirtyPoopCount > 0) && (
          <div className="pointer-events-auto hidden md:flex items-center gap-2 bg-stone-900/90 border border-amber-500/40 rounded-xl px-4 py-2 text-xs text-amber-200 shadow-md">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="flex items-center gap-2">
              {starvingDogs.length > 0 && (
                <span>
                  {starvingDogs[0].name} needs food!
                </span>
              )}
              {dirtyDogs.length > 0 && (
                <>
                  <span className="text-stone-600">·</span>
                  <span>{dirtyDogs[0].name} needs bath!</span>
                </>
              )}
              {dirtyPoopCount > 0 && (
                <>
                  <span className="text-stone-600">·</span>
                  <span>{dirtyPoopCount} mess to scoop!</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Right Status Cluster: Coins, Reputation, Controls */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3 bg-stone-900/90 border border-stone-700/60 rounded-xl px-3.5 py-2 shadow-md">
          {/* Coins */}
          <div className="flex items-center gap-1.5 text-amber-300 font-mono tabular-nums font-bold text-sm sm:text-base">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>{stats.coins}</span>
          </div>

          <span className="text-stone-700">|</span>

          {/* Reputation */}
          <div className="flex items-center gap-1 text-amber-400 font-mono tabular-nums text-xs sm:text-sm font-semibold">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{stats.reputation.toFixed(1)}</span>
          </div>

          <span className="text-stone-700">|</span>

          {/* Mute Audio */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleMute();
            }}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Pause Game */}
          <button
            onClick={() => {
              sound.playClick();
              onPause();
            }}
            title="Pause Game (Esc)"
            className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Perimeter Toolbar: Caretaker Tools & Whistle */}
      <div className="flex justify-between items-end w-full gap-4">
        {/* Whistle Button (F) */}
        <div className="pointer-events-auto">
          <button
            onClick={() => {
              onWhistle();
            }}
            title="Whistle to call all dogs! (F)"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs sm:text-sm shadow-md transition-all transform active:scale-95 cursor-pointer"
          >
            <Megaphone className="w-4 h-4" />
            <span className="hidden sm:inline">Whistle</span>
            <span className="font-mono text-[10px] px-1 py-0.5 rounded bg-amber-700 text-amber-100">[F]</span>
          </button>
        </div>

        {/* Quick Toolbelt (1 to 6) */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-stone-900/95 border border-stone-700/80 shadow-xl overflow-x-auto">
          {[
            { id: 'none' as const, label: 'Hands', icon: Hand, key: '1' },
            { id: 'ball' as const, label: 'Ball', icon: CircleDot, key: '2' },
            { id: 'kibble_scoop' as const, label: 'Kibble', icon: Utensils, key: '3' },
            { id: 'sponge' as const, label: 'Sponge', icon: Bath, key: '4' },
            { id: 'poop_scoop' as const, label: 'Scooper', icon: Trash2, key: '5' },
            { id: 'treat' as const, label: 'Treat', icon: Bone, key: '6' },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = caretaker.holdingItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playClick();
                  onSelectTool(item.id);
                }}
                className={`flex flex-col items-center justify-center w-12 sm:w-14 h-12 sm:h-14 rounded-xl text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-md scale-105'
                    : 'bg-stone-800/80 hover:bg-stone-700/80 text-stone-300'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
                <span className="text-[10px] font-mono leading-none">{item.key}</span>
              </button>
            );
          })}
        </div>

        {/* Active Dogs Count */}
        <div className="pointer-events-auto hidden sm:flex items-center gap-2 bg-stone-900/90 border border-stone-700/60 rounded-xl px-3.5 py-2.5 text-xs text-stone-300 shadow-md">
          <span className="font-semibold">{dogs.length} Pups Active</span>
        </div>
      </div>
    </div>
  );
};
