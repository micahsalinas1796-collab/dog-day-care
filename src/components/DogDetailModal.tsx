/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Heart, Bone, CircleDot, User } from 'lucide-react';
import { Dog } from '../types/game';
import { sound } from '../audio/soundManager';

interface DogDetailModalProps {
  dog: Dog;
  onClose: () => void;
  onPet: (dog: Dog) => void;
  onGiveTreat: (dog: Dog) => void;
  onPlayFetch: (dog: Dog) => void;
}

export const DogDetailModal: React.FC<DogDetailModalProps> = ({
  dog,
  onClose,
  onPet,
  onGiveTreat,
  onPlayFetch,
}) => {
  const getBreedLabel = (b: Dog['breed']) => {
    switch (b) {
      case 'golden':
        return 'Golden Retriever';
      case 'corgi':
        return 'Pembroke Welsh Corgi';
      case 'frenchie':
        return 'French Bulldog';
      case 'shiba':
        return 'Shiba Inu';
      case 'dalmatian':
        return 'Dalmatian';
      case 'poodle':
        return 'Standard Poodle';
    }
  };

  const needsList = [
    { label: 'Hunger', val: dog.needs.hunger, color: '#f59e0b' },
    { label: 'Thirst', val: dog.needs.thirst, color: '#0284c7' },
    { label: 'Cleanliness', val: dog.needs.cleanliness, color: '#06b6d4' },
    { label: 'Energy', val: dog.needs.energy, color: '#8b5cf6' },
    { label: 'Potty', val: dog.needs.potty, color: '#10b981' },
    { label: 'Happiness', val: dog.needs.happiness, color: '#ec4899' },
  ];

  return (
    <div className="absolute top-20 right-4 sm:right-8 z-20 w-80 bg-stone-900/95 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-2xl select-none">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display font-bold text-lg text-white">{dog.name}</h3>
            <span className="text-[11px] font-mono text-amber-300">
              {dog.needs.happiness}% Happy
            </span>
          </div>
          <div className="text-xs text-stone-400">
            {getBreedLabel(dog.breed)}
          </div>
        </div>
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Owner Info & Favorite Toy */}
      <div className="flex items-center gap-2 text-xs text-stone-400 bg-stone-950/60 p-2.5 rounded-xl border border-stone-800/80 mb-3.5">
        <User className="w-3.5 h-3.5 text-stone-500" />
        <span>Owner: {dog.ownerName}</span>
        <span className="text-stone-700">·</span>
        <span className="capitalize">Loves {dog.favoriteToy}</span>
      </div>

      {/* Needs Bars */}
      <div className="space-y-2 mb-4">
        {needsList.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-[11px] text-stone-400 mb-0.5">
              <span>{item.label}</span>
              <span className="font-mono tabular-nums text-stone-300">
                {Math.round(item.val)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-200"
                style={{
                  width: `${Math.max(0, Math.min(100, item.val))}%`,
                  backgroundColor: item.val < 30 ? '#ef4444' : item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => {
            sound.playClick();
            onPet(dog);
          }}
          className="py-2 px-1 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer"
        >
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-current" />
          <span>Pet</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onGiveTreat(dog);
          }}
          className="py-2 px-1 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer"
        >
          <Bone className="w-3.5 h-3.5 text-amber-400" />
          <span>Treat</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onPlayFetch(dog);
          }}
          className="py-2 px-1 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer"
        >
          <CircleDot className="w-3.5 h-3.5 text-lime-400" />
          <span>Fetch</span>
        </button>
      </div>
    </div>
  );
};
