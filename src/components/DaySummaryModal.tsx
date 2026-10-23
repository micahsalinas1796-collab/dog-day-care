/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, Coins, ArrowRight, Store, Heart } from 'lucide-react';
import { DaySummary } from '../types/game';
import { sound } from '../audio/soundManager';

interface DaySummaryModalProps {
  summary: DaySummary;
  onNextDay: () => void;
  onOpenUpgrades: () => void;
}

export const DaySummaryModal: React.FC<DaySummaryModalProps> = ({
  summary,
  onNextDay,
  onOpenUpgrades,
}) => {
  useEffect(() => {
    // Launch celebratory confetti
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <div className="absolute inset-0 bg-black/75 z-30 flex items-center justify-center p-4 select-none overflow-y-auto">
      <div className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 shadow-2xl my-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-1">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Shift Completed</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            Day {summary.dayNumber} Report Card
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            All pups have returned home happily to their pet parents!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6 bg-stone-950/60 rounded-xl p-4 border border-stone-800">
          <div className="text-center">
            <div className="text-xs text-stone-400 mb-1">Pups Cared</div>
            <div className="font-mono tabular-nums text-xl font-bold text-white">
              {summary.dogsCaredFor}
            </div>
          </div>
          <div className="text-center border-x border-stone-800">
            <div className="text-xs text-stone-400 mb-1">Paw Rating</div>
            <div className="font-mono tabular-nums text-xl font-bold text-amber-400 flex items-center justify-center gap-1">
              <Star className="w-4 h-4 fill-current" />
              <span>{summary.averageRating}</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-stone-400 mb-1">Day Earnings</div>
            <div className="font-mono tabular-nums text-xl font-bold text-emerald-400 flex items-center justify-center gap-1">
              <Coins className="w-4 h-4 text-emerald-400" />
              <span>+{summary.totalEarnings}</span>
            </div>
          </div>
        </div>

        {/* Client Reviews Section */}
        <div className="mb-6">
          <div className="text-xs font-semibold text-stone-300 uppercase tracking-wider mb-3">
            Customer Reviews & Tips
          </div>
          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
            {summary.reviews.map((rev, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-stone-800/60 border border-stone-700/40 text-xs"
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="font-semibold text-amber-200">{rev.dogName}</div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-amber-400 font-mono">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    {rev.tip > 0 && (
                      <span className="font-mono text-emerald-400">
                        +${rev.tip} tip
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-stone-300 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onOpenUpgrades();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-display font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer border border-stone-700"
          >
            <Store className="w-4 h-4 text-amber-400" />
            <span>Facility Upgrades</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onNextDay();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
          >
            <span>Start Day {summary.dayNumber + 1}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
