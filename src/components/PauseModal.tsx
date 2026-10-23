/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, Volume2, VolumeX, RotateCcw, HelpCircle } from 'lucide-react';
import { sound } from '../audio/soundManager';

interface PauseModalProps {
  onResume: () => void;
  onRestartDay: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  musicMuted: boolean;
  onToggleMusic: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestartDay,
  isMuted,
  onToggleMute,
  musicMuted,
  onToggleMusic,
}) => {
  return (
    <div className="absolute inset-0 bg-black/60 z-30 flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <h2 className="font-display font-bold text-2xl text-white mb-2 text-center">Daycare Paused</h2>
        <p className="text-xs text-stone-400 text-center mb-6">
          Take a breather! The puppies are waiting for your gentle care.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mb-6">
          <button
            onClick={() => {
              sound.playClick();
              onResume();
            }}
            className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-display font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Resume Shift</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onRestartDay();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Current Day</span>
          </button>
        </div>

        {/* Audio Toggles */}
        <div className="border-t border-stone-800 pt-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleMute}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{isMuted ? 'Muted' : 'Sound ON'}</span>
            </button>
            <button
              onClick={onToggleMusic}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs transition-colors cursor-pointer"
            >
              <span>{musicMuted ? 'Music OFF' : 'Music ON'}</span>
            </button>
          </div>
        </div>

        {/* Quick Controls Cheat Sheet */}
        <div className="bg-stone-950/60 rounded-xl p-4 border border-stone-800/80">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-300 mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Controls Guide</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-400 font-mono">
            <div>WASD / Arrows</div>
            <div className="text-stone-300">Move Caretaker</div>
            <div>Space / E</div>
            <div className="text-stone-300">Interact / Throw</div>
            <div>1 - 6</div>
            <div className="text-stone-300">Equip Tools</div>
            <div>F Key</div>
            <div className="text-stone-300">Whistle Dogs</div>
            <div>Mouse Click</div>
            <div className="text-stone-300">Walk / Pet</div>
          </div>
        </div>
      </div>
    </div>
  );
};
