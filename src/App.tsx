/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { DaycareEngine } from './game/engine';
import { DaycareRenderer } from './game/renderer';
import { sound } from './audio/soundManager';
import { GameScreen, Dog, DaySummary } from './types/game';
import { TitleScreen } from './components/TitleScreen';
import { GameHUD } from './components/GameHUD';
import { PauseModal } from './components/PauseModal';
import { DaySummaryModal } from './components/DaySummaryModal';
import { UpgradesModal } from './components/UpgradesModal';
import { DogDetailModal } from './components/DogDetailModal';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<DaycareEngine | null>(null);
  const rendererRef = useRef<DaycareRenderer | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // High-level UI states
  const [screen, setScreen] = useState<GameScreen>('TITLE');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [musicMuted, setMusicMuted] = useState<boolean>(false);
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  const [daySummary, setDaySummary] = useState<DaySummary | null>(null);

  // Reactive stats slice for HUD updates (polled at 5Hz to avoid 60fps React churn)
  const [hudStats, setHudStats] = useState({
    day: 1,
    timeOfDay: 0,
    coins: 150,
    reputation: 5.0,
    totalDogsCared: 0,
    activeDogs: 0,
  });

  // Initialize Engine
  useEffect(() => {
    const engine = new DaycareEngine();
    engineRef.current = engine;

    return () => {
      sound.stopMusic();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Initialize Canvas & 60fps Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !engineRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderer = new DaycareRenderer(ctx);
    rendererRef.current = renderer;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
      renderer.resize(width, height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Main 60fps Loop
    let lastTime = performance.now();
    lastTimeRef.current = lastTime;

    const gameLoop = (time: number) => {
      const rawDt = (time - lastTime) / 1000;
      lastTime = time;
      const dt = Math.min(rawDt, 0.05); // Clamped delta time for smooth simulation

      const engine = engineRef.current;
      if (engine) {
        // Update physics and behavior
        engine.update(dt);

        // Check if day completed
        const summary = engine.getDaySummary();
        if (summary && screen === 'PLAYING') {
          setDaySummary(summary);
          setScreen('DAY_SUMMARY');
        }

        // Render scene
        renderer.render(
          engine.caretaker,
          engine.dogs,
          engine.stations,
          engine.balls,
          engine.poops,
          engine.particles,
          engine.hoveredStationId,
          engine.hoveredDogId,
          engine.selectedDogId,
          engine.targetClick
        );
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [screen]);

  // Periodic HUD state sync timer (every 150ms)
  useEffect(() => {
    const interval = window.setInterval(() => {
      const engine = engineRef.current;
      if (!engine) return;

      setHudStats({
        day: engine.stats.day,
        timeOfDay: engine.stats.timeOfDay,
        coins: engine.stats.coins,
        reputation: engine.stats.reputation,
        totalDogsCared: engine.stats.totalDogsCared,
        activeDogs: engine.dogs.length,
      });

      // Keep selected dog synced
      if (engine.selectedDogId) {
        const found = engine.dogs.find((d) => d.id === engine.selectedDogId);
        setSelectedDog(found || null);
      } else {
        setSelectedDog(null);
      }
    }, 150);

    return () => clearInterval(interval);
  }, []);

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const engine = engineRef.current;
      if (!engine) return;

      if (e.code === 'Escape') {
        if (screen === 'PLAYING') {
          engine.stats.isPaused = true;
          setScreen('PAUSED');
        } else if (screen === 'PAUSED') {
          engine.stats.isPaused = false;
          setScreen('PLAYING');
        }
        return;
      }

      if (screen === 'PLAYING') {
        engine.handleKeyDown(e.key);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const engine = engineRef.current;
      if (engine && screen === 'PLAYING') {
        engine.handleKeyUp(e.key);
      }
    };

    const handleBlur = () => {
      const engine = engineRef.current;
      if (engine) {
        ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].forEach((k) =>
          engine.handleKeyUp(k)
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [screen]);

  // Mouse / Touch Canvas Input Handlers
  const handleCanvasPointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const engine = engineRef.current;
    if (!canvas || !engine) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert screen coordinates to in-game 1200x800 coordinate space
    const width = rect.width;
    const height = rect.height;
    const scaleX = width / 1200;
    const scaleY = height / 800;
    const scale = Math.min(scaleX, scaleY);
    const offsetX = (width - 1200 * scale) / 2;
    const offsetY = (height - 800 * scale) / 2;

    const gameX = (clickX - offsetX) / scale;
    const gameY = (clickY - offsetY) / scale;

    if (screen === 'PLAYING') {
      engine.setClickTarget(gameX, gameY);
    }
  }, [screen]);

  // Audio Toggles
  const handleToggleMute = useCallback(() => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  }, []);

  const handleToggleMusic = useCallback(() => {
    const musicActive = sound.toggleMusic();
    setMusicMuted(!musicActive);
  }, []);

  // Start Daycare from Title Screen
  const handleStartGame = useCallback(() => {
    sound.startMusic();
    const engine = engineRef.current;
    if (engine) {
      engine.stats.isPaused = false;
    }
    setScreen('PLAYING');
  }, []);

  // Pause Controls
  const handleResume = useCallback(() => {
    const engine = engineRef.current;
    if (engine) {
      engine.stats.isPaused = false;
    }
    setScreen('PLAYING');
  }, []);

  const handleRestartDay = useCallback(() => {
    const engine = engineRef.current;
    if (engine) {
      engine.startDay(engine.stats.day);
      engine.stats.isPaused = false;
    }
    setScreen('PLAYING');
  }, []);

  // End of Day & Next Day Controls
  const handleNextDay = useCallback(() => {
    const engine = engineRef.current;
    if (engine) {
      engine.startDay(engine.stats.day + 1);
      engine.stats.isPaused = false;
    }
    setDaySummary(null);
    setScreen('PLAYING');
  }, []);

  // Upgrades
  const handleBuyUpgrade = useCallback((upgradeId: string) => {
    const engine = engineRef.current;
    if (engine) {
      engine.purchaseUpgrade(upgradeId);
    }
  }, []);

  // Dog Detail Inspector Actions
  const handlePetDog = useCallback((dog: Dog) => {
    const engine = engineRef.current;
    if (engine) {
      engine.interactWithDog(dog);
    }
  }, []);

  const handleGiveTreatDog = useCallback((dog: Dog) => {
    const engine = engineRef.current;
    if (engine) {
      engine.caretaker.holdingItem = 'treat';
      engine.interactWithDog(dog);
    }
  }, []);

  const handlePlayFetchDog = useCallback((dog: Dog) => {
    const engine = engineRef.current;
    if (engine) {
      engine.throwTennisBall(engine.caretaker.x, engine.caretaker.y, dog.x + 100, dog.y);
    }
  }, []);

  return (
    <div className="relative w-full h-full bg-[#1e1b18] overflow-hidden select-none">
      {/* 60fps Isolated HTML5 Canvas Viewport */}
      <canvas
        ref={canvasRef}
        onPointerDown={handleCanvasPointerDown}
        className="absolute inset-0 block w-full h-full cursor-crosshair"
      />

      {/* Screen: Title Menu */}
      {screen === 'TITLE' && (
        <TitleScreen
          onStart={handleStartGame}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* Screen: Playing HUD */}
      {screen === 'PLAYING' && engineRef.current && (
        <>
          <GameHUD
            stats={engineRef.current.stats}
            caretaker={engineRef.current.caretaker}
            dogs={engineRef.current.dogs}
            poops={engineRef.current.poops}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onPause={() => {
              if (engineRef.current) engineRef.current.stats.isPaused = true;
              setScreen('PAUSED');
            }}
            onSelectTool={(tool) => {
              if (engineRef.current) engineRef.current.caretaker.holdingItem = tool;
            }}
            onWhistle={() => {
              if (engineRef.current) engineRef.current.whistleDogs();
            }}
          />

          {/* Dog Detail Inspector Card */}
          {selectedDog && (
            <DogDetailModal
              dog={selectedDog}
              onClose={() => {
                if (engineRef.current) engineRef.current.selectedDogId = null;
                setSelectedDog(null);
              }}
              onPet={handlePetDog}
              onGiveTreat={handleGiveTreatDog}
              onPlayFetch={handlePlayFetchDog}
            />
          )}
        </>
      )}

      {/* Screen: Paused Modal */}
      {screen === 'PAUSED' && (
        <PauseModal
          onResume={handleResume}
          onRestartDay={handleRestartDay}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          musicMuted={musicMuted}
          onToggleMusic={handleToggleMusic}
        />
      )}

      {/* Screen: Day Summary Modal */}
      {screen === 'DAY_SUMMARY' && daySummary && (
        <DaySummaryModal
          summary={daySummary}
          onNextDay={handleNextDay}
          onOpenUpgrades={() => setScreen('UPGRADES')}
        />
      )}

      {/* Screen: Upgrades Shop Modal */}
      {screen === 'UPGRADES' && engineRef.current && (
        <UpgradesModal
          upgrades={engineRef.current.upgrades}
          coins={hudStats.coins}
          onBuyUpgrade={handleBuyUpgrade}
          onClose={() => {
            if (daySummary) {
              setScreen('DAY_SUMMARY');
            } else {
              setScreen('PLAYING');
            }
          }}
        />
      )}
    </div>
  );
}
