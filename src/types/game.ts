/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GameScreen = 'TITLE' | 'PLAYING' | 'PAUSED' | 'DAY_SUMMARY' | 'UPGRADES';

export type DogBreed = 'golden' | 'corgi' | 'frenchie' | 'shiba' | 'dalmatian' | 'poodle';

export type DogState = 
  | 'idle' 
  | 'wandering' 
  | 'eating' 
  | 'drinking' 
  | 'playing_ball' 
  | 'sleeping' 
  | 'bathing' 
  | 'being_pet' 
  | 'pooping' 
  | 'waiting_pickup'
  | 'following';

export interface DogNeeds {
  hunger: number;       // 0 = starving, 100 = full
  thirst: number;       // 0 = dehydrated, 100 = satisfied
  energy: number;       // 0 = exhausted, 100 = energetic
  cleanliness: number;  // 0 = filthy muddy, 100 = sparkling
  happiness: number;    // 0 = sad whimpering, 100 = ecstatic
  potty: number;        // 0 = urgent potty, 100 = fine
}

export interface Dog {
  id: string;
  name: string;
  breed: DogBreed;
  color: string;
  earColor?: string;
  spotColor?: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  angle: number;
  facing: 1 | -1;
  state: DogState;
  stateTimer: number;
  needs: DogNeeds;
  favoriteToy: 'ball' | 'rope' | 'treat' | 'nap';
  ownerName: string;
  ownerReview?: string;
  starRating?: number;
  coinsEarned?: number;
  tailWagSpeed: number;
  tailWagOffset: number;
  walkCycle: number;
  isBarking: boolean;
  barkTimer: number;
  isMuddy: boolean;
  assignedStationId: string | null;
}

export type StationType = 
  | 'reception' 
  | 'food_bowl' 
  | 'water_bowl' 
  | 'bath_tub' 
  | 'grooming_table' 
  | 'nap_bed' 
  | 'agility_hurdle' 
  | 'ball_rack' 
  | 'treat_bar' 
  | 'poop_trash';

export interface Station {
  id: string;
  type: StationType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fillLevel: number; // 0 to 100 for bowls, or cooldown timer
  maxCapacity: number;
  currentUsers: string[]; // dog IDs
  isInteractive: boolean;
  interactionProgress: number; // 0-100
  upgradeTier: number;
}

export interface TennisBall {
  id: string;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  active: boolean;
  carriedByDogId: string | null;
}

export interface PoopMess {
  id: string;
  x: number;
  y: number;
  cleaned: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'heart' | 'star' | 'bubble' | 'crumb' | 'zzz' | 'water' | 'sparkle' | 'poop_smell' | 'dust';
  text?: string;
}

export interface Caretaker {
  x: number;
  y: number;
  targetX: number | null;
  targetY: number | null;
  vx: number;
  vy: number;
  speed: number;
  facing: 1 | -1;
  holdingItem: 'none' | 'ball' | 'kibble_scoop' | 'sponge' | 'poop_scoop' | 'treat';
  isInteracting: boolean;
  interactProgress: number;
  interactTargetId: string | null;
  walkCycle: number;
}

export interface DaycareUpgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  purchased: boolean;
  level: number;
  maxLevel: number;
  icon: string;
  effect: string;
}

export interface DaySummary {
  dayNumber: number;
  dogsCaredFor: number;
  totalEarnings: number;
  tipsEarned: number;
  averageRating: number;
  reviews: Array<{
    dogName: string;
    breed: DogBreed;
    rating: number;
    comment: string;
    tip: number;
  }>;
}

export interface DaycareStats {
  day: number;
  timeOfDay: number; // 0 (8:00 AM) to 600 (6:00 PM, 10 in-game hours)
  coins: number;
  reputation: number; // 0 to 5.0 stars
  totalDogsCared: number;
  unlockedCapacity: number;
  isPaused: boolean;
}
