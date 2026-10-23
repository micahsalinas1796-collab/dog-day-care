/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  X,
  Coins,
  Footprints,
  Utensils,
  Sparkles,
  Moon,
  Gamepad2,
  Building,
  Check,
} from 'lucide-react';
import { DaycareUpgrade } from '../types/game';
import { sound } from '../audio/soundManager';

interface UpgradesModalProps {
  upgrades: DaycareUpgrade[];
  coins: number;
  onBuyUpgrade: (upgradeId: string) => void;
  onClose: () => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Footprints,
  Utensils,
  Sparkles,
  Moon,
  Gamepad2,
  Building,
};

export const UpgradesModal: React.FC<UpgradesModalProps> = ({
  upgrades,
  coins,
  onBuyUpgrade,
  onClose,
}) => {
  return (
    <div className="absolute inset-0 bg-black/75 z-30 flex items-center justify-center p-4 select-none overflow-y-auto">
      <div className="w-full max-w-xl bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 shadow-2xl my-auto">
        {/* Top Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-display font-bold text-2xl text-white">Daycare Upgrades</h2>
            <p className="text-xs text-stone-400">
              Invest your earnings to automate chores and treat the dogs to luxury.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 font-mono text-amber-300 font-bold text-sm">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>{coins}</span>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Upgrades List */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1 mb-6">
          {upgrades.map((upg) => {
            const Icon = ICON_MAP[upg.icon] || Sparkles;
            const canAfford = coins >= upg.cost;

            return (
              <div
                key={upg.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-stone-800/60 border border-stone-700/50"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`p-2.5 rounded-xl ${
                      upg.purchased
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm">
                        {upg.name}
                      </span>
                      <span className="text-[11px] text-amber-300/80 font-mono">
                        · {upg.effect}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 leading-snug mt-0.5">
                      {upg.description}
                    </p>
                  </div>
                </div>

                {/* Purchase Button */}
                <div className="shrink-0 ml-4">
                  {upg.purchased ? (
                    <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                      <Check className="w-4 h-4" />
                      <span>Installed</span>
                    </div>
                  ) : (
                    <button
                      disabled={!canAfford}
                      onClick={() => {
                        onBuyUpgrade(upg.id);
                      }}
                      className={`px-3.5 py-1.5 rounded-lg font-mono text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        canAfford
                          ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold shadow-sm'
                          : 'bg-stone-800 text-stone-500 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>{upg.cost}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-display font-medium text-xs sm:text-sm transition-colors cursor-pointer"
        >
          Return to Shift
        </button>
      </div>
    </div>
  );
};
