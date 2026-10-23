/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { sound } from '../audio/soundManager';
import {
  Caretaker,
  DaycareStats,
  DaycareUpgrade,
  DaySummary,
  Dog,
  DogBreed,
  Particle,
  PoopMess,
  Station,
  TennisBall
} from '../types/game';

const INITIAL_STATIONS: Station[] = [
  // Reception Desk (Top Center)
  {
    id: 'st_reception',
    type: 'reception',
    name: 'Check-in Desk',
    x: 600,
    y: 110,
    width: 140,
    height: 48,
    fillLevel: 100,
    maxCapacity: 2,
    currentUsers: [],
    isInteractive: true,
    interactionProgress: 0,
    upgradeTier: 1,
  },
  // Food Bowls (Top Left)
  {
    id: 'st_food_1',
    type: 'food_bowl',
    name: 'Kibble Bowl A',
    x: 160,
    y: 130,
    width: 52,
    height: 52,
    fillLevel: 80,
    maxCapacity: 1,
    currentUsers: [],
    isInteractive: true,
    interactionProgress: 0,
    upgradeTier: 1,
  },
  {
    id: 'st_food_2',
    type: 'food_bowl',
    name: 'Kibble Bowl B',
    x: 240,
    y: 130,
    width: 52,
    height: 52,
    fillLevel: 60,
    maxCapacity: 1,
    currentUsers: [],
    isInteractive: true,
    interactionProgress: 0,
    upgradeTier: 1,
  },
  // Water Bowl (Top Left)
  {
    id: 'st_water_1',
    type: 'water_bowl',
    name: 'Fresh Fountain',
    x: 320,
    y: 130,
    width: 52,
    height: 52,
    fillLevel: 90,
    maxCapacity: 1,
    currentUsers: [],
    isInteractive: true,
    interactionProgress: 0,
    upgradeTier: 1,
  },
  // Bath Tub (Top Right)
  {
    id: 'st_bath_1',
    type: 'bath_tub',
    name: 'Bubble Spa Tub',
    x: 880,
    y: 140,
    width: 110,
    height: 64,
    fillLevel: 100,
    maxCapacity: 1,
    currentUsers: [],
    isInteractive: true,
    interactionProgress: 0,
    upgradeTier: 1,
  },
  // Grooming Table (Top Right)
  {
    id: 'st_groom_1',
    type: 'grooming_table',
    name: 'Grooming Salon',
    x: 1030,
    y: 140,
    width: 90,
    height: 54,
    fillLevel: 100,
    maxCapacity: 1,
    currentUsers: [],
    isInteractive: true,
    interactionProgress: 0,
    upgradeTier: 1,
  },
  // Nap Beds (Bottom Right Lounge)
  {
    id: 'st_bed_1',
    type: 'nap_bed',
    name: 'Plush Bed Alpha',
    x: 820,
    y: 560,
    width: 68,
    height: 54,
    fillLevel: 100,
    maxCapacity: 1,
    currentUsers: [],
    isInteractive: true,
    interactionProgress: 0,
    upgradeTier: 1,
  },
  {
    id: 'st_bed_2',
    type: 'nap_bed',
    name: 'Plush Bed Beta',
    x: 930,
    y: 560,
    width: 68,
    height: 54,
    fillLevel: 100,
    maxCapacity: 1,
    currentUsers: [],
    isInteractive: true,
    interactionProgress: 0,
    upgradeTier: 1,
  },
  {
    id: 'st_bed_3',
    type: 'nap_bed',
    name: 'Plush Bed Gamma',
    x: 1040,
    y: 560,
    width: 68,
    height: 54,
    fillLevel: 100,
    maxCapacity: 1,
    currentUsers: [],
    isInteractive: true,
    interactionProgress: 0,
    upgradeTier: 1,
  },
  // Agility Hurdle (Bottom Left Turf)
  {
    id: 'st_hurdle_1',
    type: 'agility_hurdle',
    name: 'Agility Hurdle',
    x: 260,
    y: 540,
    width: 90,
    height: 24,
    fillLevel: 100,
    maxCapacity: 1,
    currentUsers: [],
    isInteractive: true,
    interactionProgress: 0,
    upgradeTier: 1,
  },
  // Tennis Ball Rack (Bottom Left Turf)
  {
    id: 'st_ball_rack',
    type: 'ball_rack',
    name: 'Tennis Ball Bin',
    x: 120,
    y: 470,
    width: 58,
    height: 42,
    fillLevel: 100,
    maxCapacity: 1,
    currentUsers: [],
    isInteractive: true,
    interactionProgress: 0,
    upgradeTier: 1,
  },
  // Treat Bar (Center)
  {
    id: 'st_treat_bar',
    type: 'treat_bar',
    name: 'Bacon Biscuit Jar',
    x: 600,
    y: 380,
    width: 60,
    height: 44,
    fillLevel: 100,
    maxCapacity: 1,
    currentUsers: [],
    isInteractive: true,
    interactionProgress: 0,
    upgradeTier: 1,
  },
  // Waste Bin (Bottom Center)
  {
    id: 'st_poop_trash',
    type: 'poop_trash',
    name: 'Hygiene Waste Bin',
    x: 600,
    y: 710,
    width: 50,
    height: 40,
    fillLevel: 100,
    maxCapacity: 1,
    currentUsers: [],
    isInteractive: true,
    interactionProgress: 0,
    upgradeTier: 1,
  },
];

export const INITIAL_UPGRADES: DaycareUpgrade[] = [
  {
    id: 'upg_shoes',
    name: 'Turbo Staff Sneakers',
    description: 'Increases Caretaker movement speed by 40% to quickly respond to pups.',
    cost: 120,
    purchased: false,
    level: 0,
    maxLevel: 2,
    icon: 'Footprints',
    effect: 'Caretaker Speed +40%',
  },
  {
    id: 'upg_auto_feeder',
    name: 'Automated Kibble Dispensers',
    description: 'Refills food and water bowls automatically over time.',
    cost: 200,
    purchased: false,
    level: 0,
    maxLevel: 2,
    icon: 'Utensils',
    effect: 'Bowls auto-refill',
  },
  {
    id: 'upg_spa_jets',
    name: 'Hydro-Spa Whirlpool Jet',
    description: 'Dogs get cleaned in the bathtub 2x faster with luxurious soap foam.',
    cost: 280,
    purchased: false,
    level: 0,
    maxLevel: 1,
    icon: 'Sparkles',
    effect: 'Spa bath speed 2x',
  },
  {
    id: 'upg_foam_beds',
    name: 'Orthopedic Cloud Foam Beds',
    description: 'Pups regain energy and happiness much faster while napping.',
    cost: 240,
    purchased: false,
    level: 0,
    maxLevel: 2,
    icon: 'Moon',
    effect: 'Nap rest rate +60%',
  },
  {
    id: 'upg_launcher',
    name: 'Automatic Tennis Cannon',
    description: 'Periodically launches fresh tennis balls into the play yard.',
    cost: 350,
    purchased: false,
    level: 0,
    maxLevel: 1,
    icon: 'Gamepad2',
    effect: 'Auto ball launcher',
  },
  {
    id: 'upg_expansion',
    name: 'Resort License Expansion',
    description: 'Allows up to 6 simultaneous VIP dogs per daycare shift.',
    cost: 450,
    purchased: false,
    level: 0,
    maxLevel: 2,
    icon: 'Building',
    effect: 'Max Daycare capacity +2',
  },
];

const DOG_PRESETS: Array<{
  name: string;
  breed: DogBreed;
  color: string;
  earColor?: string;
  favoriteToy: 'ball' | 'rope' | 'treat' | 'nap';
  ownerName: string;
}> = [
  { name: 'Barnaby', breed: 'golden', color: '#eab308', favoriteToy: 'ball', ownerName: 'Sarah Jenkins' },
  { name: 'Mochi', breed: 'corgi', color: '#d97706', favoriteToy: 'nap', ownerName: 'Kenji Sato' },
  { name: 'Bella', breed: 'frenchie', color: '#475569', earColor: '#334155', favoriteToy: 'treat', ownerName: 'Chloe Dupont' },
  { name: 'Ziggy', breed: 'dalmatian', color: '#f8fafc', favoriteToy: 'ball', ownerName: 'Marcus Cole' },
  { name: 'Kiko', breed: 'shiba', color: '#ea580c', favoriteToy: 'rope', ownerName: 'Aiko Tanaka' },
  { name: 'Penny', breed: 'poodle', color: '#f472b6', earColor: '#db2777', favoriteToy: 'treat', ownerName: 'Eleanor Vance' },
  { name: 'Cooper', breed: 'golden', color: '#f59e0b', favoriteToy: 'ball', ownerName: 'David Miller' },
  { name: 'Waffles', breed: 'corgi', color: '#b45309', favoriteToy: 'nap', ownerName: 'Emma Watson' },
  { name: 'Ollie', breed: 'frenchie', color: '#cbd5e1', earColor: '#94a3b8', favoriteToy: 'treat', ownerName: 'Liam Brody' },
];

export class DaycareEngine {
  public caretaker: Caretaker;
  public dogs: Dog[] = [];
  public stations: Station[] = [];
  public balls: TennisBall[] = [];
  public poops: PoopMess[] = [];
  public particles: Particle[] = [];
  public upgrades: DaycareUpgrade[] = [];
  public stats: DaycareStats;

  public hoveredStationId: string | null = null;
  public hoveredDogId: string | null = null;
  public selectedDogId: string | null = null;
  public targetClick: { x: number; y: number; time: number } | null = null;

  // Day Loop Timers
  private dayDurationSec: number = 140; // ~2.3 minutes per day shift
  private dayTimer: number = 0;
  private dropOffQueue: Array<typeof DOG_PRESETS[0]> = [];
  private completedDaySummary: DaySummary | null = null;

  // Auto launcher timer
  private autoLauncherTimer: number = 0;

  // Key state tracking
  private keys: Record<string, boolean> = {};

  constructor() {
    this.caretaker = {
      x: 600,
      y: 450,
      targetX: null,
      targetY: null,
      vx: 0,
      vy: 0,
      speed: 180,
      facing: 1,
      holdingItem: 'none',
      isInteracting: false,
      interactProgress: 0,
      interactTargetId: null,
      walkCycle: 0,
    };

    this.stations = JSON.parse(JSON.stringify(INITIAL_STATIONS));
    this.upgrades = JSON.parse(JSON.stringify(INITIAL_UPGRADES));
    this.stats = {
      day: 1,
      timeOfDay: 0, // 0 = 8:00 AM, 600 = 6:00 PM
      coins: 150,
      reputation: 5.0,
      totalDogsCared: 0,
      unlockedCapacity: 3,
      isPaused: false,
    };

    this.startDay(1);
  }

  public startDay(dayNum: number) {
    this.stats.day = dayNum;
    this.stats.timeOfDay = 0;
    this.dayTimer = 0;
    this.completedDaySummary = null;
    this.dogs = [];
    this.balls = [];
    this.poops = [];
    this.particles = [];

    // Reset station levels
    this.stations.forEach((st) => {
      if (st.type === 'food_bowl') st.fillLevel = 100;
      if (st.type === 'water_bowl') st.fillLevel = 100;
      st.currentUsers = [];
    });

    // Provide 2 tennis balls on the lawn
    this.spawnTennisBall(240, 600);
    this.spawnTennisBall(340, 640);

    // Prepare drop-off queue for the day
    const countForDay = Math.min(
      this.stats.unlockedCapacity,
      2 + Math.floor(dayNum / 2) + Math.floor(Math.random() * 2)
    );
    const shuffled = [...DOG_PRESETS].sort(() => Math.random() - 0.5);
    this.dropOffQueue = shuffled.slice(0, countForDay);

    // Initial drop off 1 dog immediately at 8:00 AM
    this.checkNextDropOff(true);

    sound.playDayEndChime();
  }

  public update(dt: number) {
    if (this.stats.isPaused) return;

    // Advance Day Clock
    this.dayTimer += dt;
    this.stats.timeOfDay = (this.dayTimer / this.dayDurationSec) * 600;

    // Auto kibble upgrade
    const autoFeeder = this.upgrades.find((u) => u.id === 'upg_auto_feeder');
    if (autoFeeder && autoFeeder.purchased) {
      this.stations.forEach((st) => {
        if (st.type === 'food_bowl' || st.type === 'water_bowl') {
          if (st.fillLevel < 100) st.fillLevel = Math.min(100, st.fillLevel + dt * 4);
        }
      });
    }

    // Auto ball launcher upgrade
    const ballLauncher = this.upgrades.find((u) => u.id === 'upg_launcher');
    if (ballLauncher && ballLauncher.purchased) {
      this.autoLauncherTimer += dt;
      if (this.autoLauncherTimer > 25) {
        this.autoLauncherTimer = 0;
        this.spawnTennisBall(120, 480, (Math.random() - 0.5) * 80 + 120, (Math.random() - 0.5) * 80 + 50);
        sound.playBounce();
      }
    }

    // Check for drop-offs during morning (0 - 300)
    if (this.dropOffQueue.length > 0 && this.dayTimer > 8) {
      const dropInterval = (this.dayDurationSec * 0.45) / (this.dropOffQueue.length + 1);
      if (this.dayTimer % dropInterval < dt * 2) {
        this.checkNextDropOff();
      }
    }

    // Update Caretaker
    this.updateCaretaker(dt);

    // Update Dogs AI
    this.updateDogs(dt);

    // Update Tennis Balls
    this.updateBalls(dt);

    // Update Particles
    this.updateParticles(dt);

    // Check Day End (6:00 PM)
    if (this.dayTimer >= this.dayDurationSec && !this.completedDaySummary) {
      this.finishDay();
    }
  }

  // --- Caretaker Input & Movement ---
  public handleKeyDown(key: string) {
    this.keys[key.toLowerCase()] = true;

    if (key === ' ' || key.toLowerCase() === 'e') {
      this.interactClosest();
    } else if (key.toLowerCase() === 'f') {
      this.whistleDogs();
    } else if (key === '1') {
      this.caretaker.holdingItem = 'none';
      sound.playClick();
    } else if (key === '2') {
      this.caretaker.holdingItem = 'ball';
      sound.playSqueak();
    } else if (key === '3') {
      this.caretaker.holdingItem = 'kibble_scoop';
      sound.playClick();
    } else if (key === '4') {
      this.caretaker.holdingItem = 'sponge';
      sound.playSplash();
    } else if (key === '5') {
      this.caretaker.holdingItem = 'poop_scoop';
      sound.playSweep();
    } else if (key === '6') {
      this.caretaker.holdingItem = 'treat';
      sound.playClick();
    }
  }

  public handleKeyUp(key: string) {
    this.keys[key.toLowerCase()] = false;
  }

  public setClickTarget(x: number, y: number) {
    // Check if clicked directly on an interactive station
    const clickedStation = this.stations.find((st) => {
      const dist = Math.hypot(st.x - x, st.y - y);
      return dist < Math.max(st.width, st.height) / 1.5;
    });

    // Check if clicked directly on a dog
    const clickedDog = this.dogs.find((d) => {
      return Math.hypot(d.x - x, d.y - y) < 30;
    });

    if (clickedDog) {
      this.selectedDogId = clickedDog.id;
    }

    this.caretaker.targetX = Math.max(80, Math.min(1120, x));
    this.caretaker.targetY = Math.max(80, Math.min(720, y));
    this.targetClick = { x, y, time: Date.now() };

    // If close enough to clicked object, trigger interaction
    if (clickedStation) {
      if (Math.hypot(this.caretaker.x - clickedStation.x, this.caretaker.y - clickedStation.y) < 70) {
        this.interactWithStation(clickedStation);
      }
    } else if (clickedDog) {
      if (Math.hypot(this.caretaker.x - clickedDog.x, this.caretaker.y - clickedDog.y) < 60) {
        this.interactWithDog(clickedDog);
      }
    }
  }

  private updateCaretaker(dt: number) {
    const c = this.caretaker;

    // Upgrade speed bonus
    const speedUpg = this.upgrades.find((u) => u.id === 'upg_shoes');
    const speedMultiplier = speedUpg && speedUpg.purchased ? 1.4 : 1.0;
    const currentSpeed = c.speed * speedMultiplier;

    let moveX = 0;
    let moveY = 0;

    // Keyboard inputs
    if (this.keys['w'] || this.keys['arrowup']) moveY -= 1;
    if (this.keys['s'] || this.keys['arrowdown']) moveY += 1;
    if (this.keys['a'] || this.keys['arrowleft']) moveX -= 1;
    if (this.keys['d'] || this.keys['arrowright']) moveX += 1;

    // If keyboard is pressed, cancel target click destination
    if (moveX !== 0 || moveY !== 0) {
      c.targetX = null;
      c.targetY = null;

      const len = Math.hypot(moveX, moveY);
      moveX = (moveX / len) * currentSpeed;
      moveY = (moveY / len) * currentSpeed;
    } else if (c.targetX !== null && c.targetY !== null) {
      // Click pathing
      const dx = c.targetX - c.x;
      const dy = c.targetY - c.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 8) {
        moveX = (dx / dist) * currentSpeed;
        moveY = (dy / dist) * currentSpeed;
      } else {
        c.targetX = null;
        c.targetY = null;
      }
    }

    c.vx = moveX;
    c.vy = moveY;

    if (moveX !== 0) {
      c.facing = moveX > 0 ? 1 : -1;
    }

    c.x = Math.max(70, Math.min(1130, c.x + c.vx * dt));
    c.y = Math.max(70, Math.min(730, c.y + c.vy * dt));

    if (Math.hypot(c.vx, c.vy) > 5) {
      c.walkCycle += dt;
    }
  }

  // --- Dog AI and Need Simulation ---
  private updateDogs(dt: number) {
    this.dogs.forEach((dog) => {
      dog.stateTimer += dt;
      dog.walkCycle += dt;

      // Decay needs
      dog.needs.hunger = Math.max(0, dog.needs.hunger - dt * 1.2);
      dog.needs.thirst = Math.max(0, dog.needs.thirst - dt * 1.5);
      dog.needs.energy = Math.max(0, dog.needs.energy - dt * 0.8);
      dog.needs.cleanliness = Math.max(0, dog.needs.cleanliness - dt * 0.6);
      dog.needs.potty = Math.max(0, dog.needs.potty - dt * 1.4);

      // Potty check (if potty gets below 10, dog poops)
      if (dog.needs.potty <= 5 && dog.state !== 'pooping' && dog.state !== 'bathing') {
        this.triggerDogPoop(dog);
      }

      // Calculate overall happiness
      const avgNeeds =
        (dog.needs.hunger +
          dog.needs.thirst +
          dog.needs.energy +
          dog.needs.cleanliness +
          dog.needs.potty) / 5;
      dog.needs.happiness = Math.round(avgNeeds);
      dog.tailWagSpeed = 1 + (dog.needs.happiness / 100) * 3;

      // Barking behavior
      if (dog.isBarking) {
        dog.barkTimer -= dt;
        if (dog.barkTimer <= 0) dog.isBarking = false;
      } else if (Math.random() < 0.003 && dog.state !== 'sleeping') {
        dog.isBarking = true;
        dog.barkTimer = 0.8;
        sound.playBark(dog.breed);
      }

      // State Machine
      switch (dog.state) {
        case 'idle':
        case 'wandering': {
          this.handleDogWander(dog, dt);
          break;
        }

        case 'eating': {
          if (dog.stateTimer > 4.5) {
            dog.needs.hunger = 100;
            dog.state = 'idle';
            this.spawnParticles(dog.x, dog.y - 10, 'crumb', 8, '#78350f');
            sound.playHeartPurr();
          } else {
            if (Math.random() < 0.08) sound.playMunch();
          }
          break;
        }

        case 'drinking': {
          if (dog.stateTimer > 3.5) {
            dog.needs.thirst = 100;
            dog.state = 'idle';
            this.spawnParticles(dog.x, dog.y - 10, 'water', 6, '#38bdf8');
          }
          break;
        }

        case 'sleeping': {
          const bedUpg = this.upgrades.find((u) => u.id === 'upg_foam_beds');
          const sleepRate = bedUpg && bedUpg.purchased ? 18 : 10;
          dog.needs.energy = Math.min(100, dog.needs.energy + dt * sleepRate);

          if (Math.random() < 0.04) {
            this.spawnZzz(dog.x + 8, dog.y - 20);
          }

          if (dog.needs.energy >= 95 || dog.stateTimer > 15) {
            dog.state = 'idle';
            this.spawnParticles(dog.x, dog.y - 20, 'heart', 3, '#f43f5e');
          }
          break;
        }

        case 'bathing': {
          const spaUpg = this.upgrades.find((u) => u.id === 'upg_spa_jets');
          const bathSpeed = spaUpg && spaUpg.purchased ? 25 : 12;
          dog.needs.cleanliness = Math.min(100, dog.needs.cleanliness + dt * bathSpeed);

          if (Math.random() < 0.15) {
            this.spawnParticles(dog.x + (Math.random() - 0.5) * 20, dog.y - 10, 'bubble', 2, '#38bdf8');
          }

          if (dog.needs.cleanliness >= 100 || dog.stateTimer > 7) {
            dog.isMuddy = false;
            dog.state = 'idle';
            this.spawnParticles(dog.x, dog.y - 20, 'star', 6, '#fbbf24');
            sound.playHeartPurr();
          }
          break;
        }

        case 'playing_ball': {
          this.handleDogFetch(dog, dt);
          break;
        }

        case 'pooping': {
          if (dog.stateTimer > 2.5) {
            dog.needs.potty = 100;
            dog.state = 'idle';
            this.poops.push({
              id: 'poop_' + Date.now(),
              x: dog.x,
              y: dog.y + 8,
              cleaned: false,
            });
          }
          break;
        }

        case 'being_pet': {
          if (dog.stateTimer > 2) {
            dog.state = 'idle';
          }
          break;
        }

        case 'following': {
          const dx = this.caretaker.x - dog.x;
          const dy = this.caretaker.y - dog.y;
          const dist = Math.hypot(dx, dy);

          if (dist > 50) {
            dog.vx = (dx / dist) * 110;
            dog.vy = (dy / dist) * 110;
            dog.facing = dog.vx > 0 ? 1 : -1;
            dog.x += dog.vx * dt;
            dog.y += dog.vy * dt;
          } else {
            dog.vx = 0;
            dog.vy = 0;
          }
          break;
        }
      }
    });
  }

  private handleDogWander(dog: Dog, dt: number) {
    // Check if there is an active bouncing tennis ball nearby to chase!
    const activeBall = this.balls.find((b) => b.active && b.carriedByDogId === null);
    if (activeBall && dog.needs.energy > 30) {
      dog.state = 'playing_ball';
      dog.stateTimer = 0;
      return;
    }

    // Check urgent needs: if starving, walk towards food bowl
    if (dog.needs.hunger < 30) {
      const foodBowl = this.stations.find((st) => st.type === 'food_bowl' && st.fillLevel > 15);
      if (foodBowl) {
        this.walkDogTowards(dog, foodBowl.x + 15, foodBowl.y + 15, dt, 90);
        if (Math.hypot(dog.x - (foodBowl.x + 15), dog.y - (foodBowl.y + 15)) < 30) {
          dog.state = 'eating';
          dog.stateTimer = 0;
          foodBowl.fillLevel = Math.max(0, foodBowl.fillLevel - 20);
        }
        return;
      }
    }

    // Check thirst: if thirsty, walk towards water bowl
    if (dog.needs.thirst < 30) {
      const waterBowl = this.stations.find((st) => st.type === 'water_bowl' && st.fillLevel > 15);
      if (waterBowl) {
        this.walkDogTowards(dog, waterBowl.x + 15, waterBowl.y + 15, dt, 90);
        if (Math.hypot(dog.x - (waterBowl.x + 15), dog.y - (waterBowl.y + 15)) < 30) {
          dog.state = 'drinking';
          dog.stateTimer = 0;
          waterBowl.fillLevel = Math.max(0, waterBowl.fillLevel - 20);
        }
        return;
      }
    }

    // Check exhaustion: walk towards nap bed
    if (dog.needs.energy < 25) {
      const emptyBed = this.stations.find(
        (st) => st.type === 'nap_bed' && !this.dogs.some((d) => d.state === 'sleeping' && d.assignedStationId === st.id)
      );
      if (emptyBed) {
        this.walkDogTowards(dog, emptyBed.x, emptyBed.y, dt, 75);
        if (Math.hypot(dog.x - emptyBed.x, dog.y - emptyBed.y) < 25) {
          dog.state = 'sleeping';
          dog.assignedStationId = emptyBed.id;
          dog.stateTimer = 0;
        }
        return;
      }
    }

    // Normal casual wandering
    if (dog.stateTimer > 3 + Math.random() * 4) {
      dog.stateTimer = 0;
      dog.targetX = 120 + Math.random() * 960;
      dog.targetY = 160 + Math.random() * 540;
    }

    this.walkDogTowards(dog, dog.targetX, dog.targetY, dt, 55);
  }

  private handleDogFetch(dog: Dog, dt: number) {
    const ball = this.balls.find((b) => b.active);
    if (!ball) {
      dog.state = 'idle';
      return;
    }

    if (ball.carriedByDogId === dog.id) {
      // Bring ball back to Caretaker!
      this.walkDogTowards(dog, this.caretaker.x, this.caretaker.y, dt, 110);
      ball.x = dog.x + dog.facing * 12;
      ball.y = dog.y - 10;
      ball.z = 0;

      if (Math.hypot(dog.x - this.caretaker.x, dog.y - this.caretaker.y) < 45) {
        // Returned to caretaker!
        ball.carriedByDogId = null;
        ball.active = false;
        dog.state = 'idle';
        dog.needs.energy = Math.max(0, dog.needs.energy - 10);
        dog.needs.happiness = Math.min(100, dog.needs.happiness + 25);
        this.spawnParticles(dog.x, dog.y - 20, 'heart', 5, '#f43f5e');
        sound.playHeartPurr();
        sound.playBark(dog.breed);
      }
    } else if (ball.carriedByDogId === null) {
      // Chase after ball
      this.walkDogTowards(dog, ball.x, ball.y, dt, 120);
      if (Math.hypot(dog.x - ball.x, dog.y - ball.y) < 25 && ball.z < 10) {
        ball.carriedByDogId = dog.id;
        sound.playSqueak();
      }
    }
  }

  private walkDogTowards(dog: Dog, tx: number, ty: number, dt: number, speed: number) {
    const dx = tx - dog.x;
    const dy = ty - dog.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 6) {
      dog.vx = (dx / dist) * speed;
      dog.vy = (dy / dist) * speed;
      dog.facing = dog.vx > 0 ? 1 : -1;
      dog.x += dog.vx * dt;
      dog.y += dog.vy * dt;
    } else {
      dog.vx = 0;
      dog.vy = 0;
    }
  }

  private triggerDogPoop(dog: Dog) {
    dog.state = 'pooping';
    dog.stateTimer = 0;
    dog.vx = 0;
    dog.vy = 0;
  }

  // --- Ball Physics ---
  public throwTennisBall(originX: number, originY: number, targetX: number, targetY: number) {
    const dx = targetX - originX;
    const dy = targetY - originY;
    const dist = Math.max(50, Math.min(400, Math.hypot(dx, dy)));
    const angle = Math.atan2(dy, dx);

    const speed = 280;
    this.balls.push({
      id: 'ball_' + Date.now(),
      x: originX,
      y: originY,
      z: 15,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      vz: 160,
      active: true,
      carriedByDogId: null,
    });

    sound.playBounce();
  }

  private spawnTennisBall(x: number, y: number, vx: number = 0, vy: number = 0) {
    this.balls.push({
      id: 'ball_' + Date.now() + Math.random(),
      x,
      y,
      z: 0,
      vx,
      vy,
      vz: 0,
      active: true,
      carriedByDogId: null,
    });
  }

  private updateBalls(dt: number) {
    this.balls.forEach((ball) => {
      if (!ball.active || ball.carriedByDogId !== null) return;

      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;
      ball.z += ball.vz * dt;

      // Friction
      ball.vx *= Math.pow(0.85, dt * 60);
      ball.vy *= Math.pow(0.85, dt * 60);

      // Gravity & Bounce
      ball.vz -= 380 * dt;

      if (ball.z <= 0) {
        ball.z = 0;
        if (Math.abs(ball.vz) > 30) {
          ball.vz = -ball.vz * 0.55;
          sound.playBounce();
        } else {
          ball.vz = 0;
        }
      }

      // Play yard boundaries
      ball.x = Math.max(60, Math.min(1140, ball.x));
      ball.y = Math.max(60, Math.min(740, ball.y));
    });
  }

  // --- Interactions ---
  public interactClosest() {
    const c = this.caretaker;

    // Check closest poop mess first (high priority clean)
    const closestPoop = this.poops.find((p) => !p.cleaned && Math.hypot(c.x - p.x, c.y - p.y) < 45);
    if (closestPoop) {
      closestPoop.cleaned = true;
      sound.playSweep();
      this.spawnParticles(closestPoop.x, closestPoop.y, 'dust', 5, '#84cc16');
      return;
    }

    // Check closest dog
    const closestDog = this.dogs.find((d) => Math.hypot(c.x - d.x, c.y - d.y) < 55);
    if (closestDog) {
      this.interactWithDog(closestDog);
      return;
    }

    // Check closest station
    const closestStation = this.stations.find(
      (st) => Math.hypot(c.x - st.x, c.y - st.y) < Math.max(st.width, st.height) / 1.5 + 40
    );
    if (closestStation) {
      this.interactWithStation(closestStation);
      return;
    }

    // If holding a ball, throw it!
    if (c.holdingItem === 'ball') {
      const throwTargetX = c.x + c.facing * 180;
      const throwTargetY = c.y + (Math.random() - 0.5) * 60;
      this.throwTennisBall(c.x, c.y, throwTargetX, throwTargetY);
    }
  }

  public interactWithDog(dog: Dog) {
    const c = this.caretaker;

    if (c.holdingItem === 'treat') {
      // Feed gourmet treat!
      dog.needs.hunger = Math.min(100, dog.needs.hunger + 40);
      dog.needs.happiness = 100;
      this.spawnParticles(dog.x, dog.y - 20, 'heart', 8, '#f43f5e');
      sound.playHeartPurr();
      sound.playBark(dog.breed);
    } else if (c.holdingItem === 'sponge' || dog.needs.cleanliness < 40) {
      // Groom / wash dog
      dog.needs.cleanliness = 100;
      dog.isMuddy = false;
      this.spawnParticles(dog.x, dog.y - 15, 'bubble', 6, '#38bdf8');
      this.spawnParticles(dog.x, dog.y - 25, 'sparkle', 4, '#fbbf24');
      sound.playSplash();
    } else if (c.holdingItem === 'ball') {
      // Throw ball for this specific dog
      this.throwTennisBall(c.x, c.y, dog.x + c.facing * 150, dog.y);
    } else {
      // Pet dog!
      dog.state = 'being_pet';
      dog.stateTimer = 0;
      dog.needs.happiness = Math.min(100, dog.needs.happiness + 20);
      this.spawnParticles(dog.x, dog.y - 20, 'heart', 4, '#f43f5e');
      sound.playHeartPurr();
    }
  }

  public interactWithStation(st: Station) {
    const c = this.caretaker;

    switch (st.type) {
      case 'reception':
        // Desk check
        sound.playClick();
        break;

      case 'food_bowl':
        st.fillLevel = 100;
        sound.playMunch();
        this.spawnParticles(st.x, st.y - 10, 'crumb', 6, '#78350f');
        break;

      case 'water_bowl':
        st.fillLevel = 100;
        sound.playSplash();
        this.spawnParticles(st.x, st.y - 10, 'water', 6, '#38bdf8');
        break;

      case 'ball_rack':
        c.holdingItem = 'ball';
        sound.playSqueak();
        break;

      case 'treat_bar':
        c.holdingItem = 'treat';
        sound.playClick();
        break;

      case 'bath_tub': {
        // Bring closest dirty dog to bath
        const dirtyDog = this.dogs.find((d) => d.needs.cleanliness < 60 || d.isMuddy);
        if (dirtyDog) {
          dirtyDog.x = st.x;
          dirtyDog.y = st.y + 10;
          dirtyDog.state = 'bathing';
          dirtyDog.stateTimer = 0;
          sound.playSplash();
        }
        break;
      }

      case 'grooming_table':
        c.holdingItem = 'sponge';
        sound.playSplash();
        break;

      case 'poop_trash':
        c.holdingItem = 'poop_scoop';
        sound.playSweep();
        break;
    }
  }

  public whistleDogs() {
    sound.playWhistle();
    this.dogs.forEach((dog) => {
      if (dog.state !== 'sleeping') {
        dog.state = 'following';
        dog.stateTimer = 0;
      }
    });
  }

  // --- Day Shift Lifecycle & Reviews ---
  private checkNextDropOff(immediate: boolean = false) {
    if (this.dropOffQueue.length === 0) return;

    const preset = this.dropOffQueue.shift()!;
    const newDog: Dog = {
      id: 'dog_' + Date.now() + Math.random(),
      name: preset.name,
      breed: preset.breed,
      color: preset.color,
      earColor: preset.earColor,
      x: 600,
      y: 80,
      targetX: 600,
      targetY: 200,
      vx: 0,
      vy: 60,
      angle: 0,
      facing: 1,
      state: 'wandering',
      stateTimer: 0,
      needs: {
        hunger: 70 + Math.random() * 20,
        thirst: 65 + Math.random() * 25,
        energy: 80 + Math.random() * 20,
        cleanliness: 85 + Math.random() * 15,
        happiness: 90,
        potty: 80 + Math.random() * 20,
      },
      favoriteToy: preset.favoriteToy,
      ownerName: preset.ownerName,
      tailWagSpeed: 2,
      tailWagOffset: Math.random() * Math.PI,
      walkCycle: 0,
      isBarking: false,
      barkTimer: 0,
      isMuddy: false,
      assignedStationId: null,
    };

    this.dogs.push(newDog);
    this.stats.totalDogsCared++;

    if (!immediate) {
      sound.playBark(newDog.breed);
    }
  }

  private finishDay() {
    sound.playDayEndChime();

    let totalRating = 0;
    let earnings = 0;
    let tips = 0;
    const reviews: DaySummary['reviews'] = [];

    this.dogs.forEach((dog) => {
      // Calculate rating based on end of day happiness & needs
      const score = dog.needs.happiness;
      let stars = 5;
      let comment = `${dog.name} came home happier than ever! Best daycare in town!`;

      if (score < 40) {
        stars = 2;
        comment = `${dog.name} seemed a little grumbly and hungry. Hope tomorrow goes better.`;
      } else if (score < 65) {
        stars = 3;
        comment = `${dog.name} had an okay time, but had lots of pent-up energy.`;
      } else if (score < 85) {
        stars = 4;
        comment = `${dog.name} had great fun! Fur was nice and brushed.`;
      }

      const baseFee = 60;
      const tip = stars >= 4 ? Math.round(stars * 8) : 0;

      dog.starRating = stars;
      dog.coinsEarned = baseFee + tip;
      totalRating += stars;
      earnings += baseFee;
      tips += tip;

      reviews.push({
        dogName: dog.name,
        breed: dog.breed,
        rating: stars,
        comment,
        tip,
      });
    });

    const avgRating = this.dogs.length > 0 ? Number((totalRating / this.dogs.length).toFixed(1)) : 5.0;
    const totalDayEarnings = earnings + tips;

    this.stats.coins += totalDayEarnings;
    this.stats.reputation = Number(((this.stats.reputation * 0.7) + (avgRating * 0.3)).toFixed(1));

    this.completedDaySummary = {
      dayNumber: this.stats.day,
      dogsCaredFor: this.dogs.length,
      totalEarnings: totalDayEarnings,
      tipsEarned: tips,
      averageRating: avgRating,
      reviews,
    };
  }

  public getDaySummary(): DaySummary | null {
    return this.completedDaySummary;
  }

  // --- Particles ---
  private spawnParticles(x: number, y: number, type: Particle['type'], count: number, color: string) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y + (Math.random() - 0.5) * 16,
        vx: (Math.random() - 0.5) * 50,
        vy: -20 - Math.random() * 40,
        alpha: 1,
        life: 0,
        maxLife: 0.8 + Math.random() * 0.6,
        size: 5 + Math.random() * 5,
        color,
        type,
      });
    }
  }

  private spawnZzz(x: number, y: number) {
    this.particles.push({
      x,
      y,
      vx: 8 + Math.random() * 12,
      vy: -24 - Math.random() * 15,
      alpha: 1,
      life: 0,
      maxLife: 1.4,
      size: 11,
      color: '#818cf8',
      type: 'zzz',
      text: Math.random() < 0.5 ? 'Z' : 'z',
    });
  }

  private updateParticles(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += dt;
      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.alpha = Math.max(0, 1 - p.life / p.maxLife);
    }
  }

  // --- Upgrades Purchasing ---
  public purchaseUpgrade(upgradeId: string): boolean {
    const upg = this.upgrades.find((u) => u.id === upgradeId);
    if (!upg || upg.purchased) return false;
    if (this.stats.coins < upg.cost) return false;

    this.stats.coins -= upg.cost;
    upg.purchased = true;
    upg.level++;

    if (upg.id === 'upg_expansion') {
      this.stats.unlockedCapacity += 2;
    }

    sound.playCoin();
    return true;
  }
}
