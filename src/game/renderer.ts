/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Caretaker, Dog, Particle, PoopMess, Station, TennisBall } from '../types/game';

export class DaycareRenderer {
  private ctx: CanvasRenderingContext2D;
  private width: number = 1440;
  private height: number = 900;
  private scale: number = 1;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  public resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    // Base design is 1200x800
    const scaleX = width / 1200;
    const scaleY = height / 800;
    this.scale = Math.min(scaleX, scaleY);
  }

  public render(
    caretaker: Caretaker,
    dogs: Dog[],
    stations: Station[],
    balls: TennisBall[],
    poops: PoopMess[],
    particles: Particle[],
    hoveredStationId: string | null,
    hoveredDogId: string | null,
    selectedDogId: string | null,
    targetClick: { x: number; y: number; time: number } | null
  ) {
    const ctx = this.ctx;
    ctx.save();

    // Clear
    ctx.fillStyle = '#2b231d';
    ctx.fillRect(0, 0, this.width, this.height);

    // Center the viewport
    const offsetX = (this.width - 1200 * this.scale) / 2;
    const offsetY = (this.height - 800 * this.scale) / 2;
    ctx.translate(offsetX, offsetY);
    ctx.scale(this.scale, this.scale);

    // 1. Draw Daycare Floor Plan & Decor
    this.drawEnvironment(ctx, stations, hoveredStationId);

    // 2. Draw Target Move Indicator
    if (targetClick && Date.now() - targetClick.time < 800) {
      this.drawTargetClick(ctx, targetClick);
    }

    // 3. Draw Poop Messes
    poops.forEach((poop) => this.drawPoop(ctx, poop));

    // 4. Draw Stations Back/Decor
    stations.forEach((st) => this.drawStation(ctx, st, hoveredStationId === st.id));

    // 5. Draw Tennis Balls (ground)
    balls.forEach((ball) => {
      if (ball.active) this.drawTennisBall(ctx, ball);
    });

    // 6. Draw Entities sorted by Y coordinate for depth
    const entities: Array<{ type: 'dog' | 'caretaker'; y: number; data: Dog | Caretaker }> = [
      { type: 'caretaker', y: caretaker.y, data: caretaker },
      ...dogs.map((d) => ({ type: 'dog' as const, y: d.y, data: d })),
    ];
    entities.sort((a, b) => a.y - b.y);

    entities.forEach((entity) => {
      if (entity.type === 'caretaker') {
        this.drawCaretaker(ctx, entity.data as Caretaker);
      } else {
        const dog = entity.data as Dog;
        const isSelected = selectedDogId === dog.id;
        const isHovered = hoveredDogId === dog.id;
        this.drawDog(ctx, dog, isSelected, isHovered);
      }
    });

    // 7. Draw Particles
    this.drawParticles(ctx, particles);

    ctx.restore();
  }

  // --- Environment & Room Layout ---
  private drawEnvironment(ctx: CanvasRenderingContext2D, _stations: Station[], _hoveredId: string | null) {
    // Main Floor (Warm Scandinavian Parquet Wood)
    ctx.fillStyle = '#e5ceaa';
    ctx.fillRect(40, 40, 1120, 720);

    // Subtle wood planks
    ctx.strokeStyle = '#d7bc94';
    ctx.lineWidth = 1.5;
    for (let y = 40; y < 760; y += 45) {
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(1160, y);
      ctx.stroke();
    }
    // Vertical staggered joints
    for (let y = 40; y < 760; y += 45) {
      const offset = (Math.floor(y / 45) % 3) * 60;
      for (let x = 40 + offset; x < 1160; x += 180) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + 45);
        ctx.stroke();
      }
    }

    // Play Turf Area (Lush green indoor astroturf for agility & fetch) - Bottom Left
    ctx.fillStyle = '#65a854';
    this.roundRect(ctx, 60, 430, 420, 310, 20);
    ctx.fill();

    // Turf border & grass stripes
    ctx.strokeStyle = '#579447';
    ctx.lineWidth = 4;
    this.roundRect(ctx, 60, 430, 420, 310, 20);
    ctx.stroke();

    ctx.fillStyle = '#5ca04b';
    for (let x = 80; x < 460; x += 40) {
      ctx.fillRect(x, 432, 20, 306);
    }

    // Nap Room Area (Soft Lavender-Blue Carpet) - Bottom Right
    ctx.fillStyle = '#9cb8c9';
    this.roundRect(ctx, 720, 440, 420, 300, 20);
    ctx.fill();
    ctx.strokeStyle = '#85a3b6';
    ctx.lineWidth = 4;
    this.roundRect(ctx, 720, 440, 420, 300, 20);
    ctx.stroke();

    // Cozy Rug in Nap Area
    ctx.fillStyle = '#fed7aa';
    this.roundRect(ctx, 780, 500, 300, 180, 30);
    ctx.fill();
    ctx.strokeStyle = '#fb923c';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 8]);
    this.roundRect(ctx, 785, 505, 290, 170, 25);
    ctx.stroke();
    ctx.setLineDash([]);

    // Grooming & Bath Zone (Ceramic Turquoise Tile) - Top Right
    ctx.fillStyle = '#c7ecee';
    this.roundRect(ctx, 740, 60, 400, 280, 16);
    ctx.fill();
    ctx.strokeStyle = '#95afc0';
    ctx.lineWidth = 1.5;
    for (let x = 740; x <= 1140; x += 35) {
      ctx.beginPath();
      ctx.moveTo(x, 60);
      ctx.lineTo(x, 340);
      ctx.stroke();
    }
    for (let y = 60; y <= 340; y += 35) {
      ctx.beginPath();
      ctx.moveTo(740, y);
      ctx.lineTo(1140, y);
      ctx.stroke();
    }

    // Dining Corner Mat (Soft Terra Cotta) - Top Left
    ctx.fillStyle = '#fbd4b4';
    this.roundRect(ctx, 60, 60, 380, 260, 16);
    ctx.fill();
    ctx.strokeStyle = '#f8b282';
    ctx.lineWidth = 3;
    this.roundRect(ctx, 60, 60, 380, 260, 16);
    ctx.stroke();

    // Outer Room Walls & Baseboards
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#6d4c41';
    this.roundRect(ctx, 40, 40, 1120, 720, 16);
    ctx.stroke();

    // Inner subtle shadow
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    this.roundRect(ctx, 47, 47, 1106, 706, 12);
    ctx.stroke();

    // Front Entrance Door Mat at Top Center
    ctx.fillStyle = '#d97706';
    this.roundRect(ctx, 520, 42, 160, 40, 8);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('WELCOME PAWS', 600, 66);
  }

  // --- Station Drawing ---
  private drawStation(ctx: CanvasRenderingContext2D, st: Station, isHovered: boolean) {
    ctx.save();
    ctx.translate(st.x, st.y);

    // Hover glow
    if (isHovered) {
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 18;
    }

    switch (st.type) {
      case 'reception': {
        // Front Desk Counter
        ctx.fillStyle = '#8d5b4c';
        this.roundRect(ctx, -st.width / 2, -st.height / 2, st.width, st.height, 10);
        ctx.fill();
        ctx.fillStyle = '#a6715f';
        this.roundRect(ctx, -st.width / 2 + 5, -st.height / 2 + 5, st.width - 10, st.height - 10, 6);
        ctx.fill();

        // Guestbook & Desk bell
        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(-35, -12, 28, 20);
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.arc(20, -2, 8, 0, Math.PI * 2);
        ctx.fill();

        // Sign text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px "Outfit", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('RECEPTION', 0, 14);
        break;
      }

      case 'food_bowl': {
        // Wooden tray
        ctx.fillStyle = '#b45309';
        this.roundRect(ctx, -st.width / 2, -st.height / 2, st.width, st.height, 8);
        ctx.fill();

        // Bowl rim
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(0, 0, 22, 0, Math.PI * 2);
        ctx.fill();

        // Kibble fill
        ctx.fillStyle = st.fillLevel > 20 ? '#78350f' : '#cbd5e1';
        ctx.beginPath();
        ctx.arc(0, 0, 17, 0, Math.PI * 2);
        ctx.fill();

        // Kibble bits
        if (st.fillLevel > 20) {
          ctx.fillStyle = '#92400e';
          for (let i = -8; i <= 8; i += 6) {
            ctx.beginPath();
            ctx.arc(i, -2 + (i % 4), 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Fill meter
        this.drawMiniFillBar(ctx, 0, 26, st.fillLevel, '#d97706');
        break;
      }

      case 'water_bowl': {
        ctx.fillStyle = '#0284c7';
        this.roundRect(ctx, -st.width / 2, -st.height / 2, st.width, st.height, 8);
        ctx.fill();

        // Bowl
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.arc(0, 0, 22, 0, Math.PI * 2);
        ctx.fill();

        // Water
        ctx.fillStyle = st.fillLevel > 15 ? '#38bdf8' : '#e2e8f0';
        ctx.beginPath();
        ctx.arc(0, 0, 17, 0, Math.PI * 2);
        ctx.fill();

        // Ripple
        if (st.fillLevel > 15) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(0, 0, 8, 0, Math.PI * 2);
          ctx.stroke();
        }

        this.drawMiniFillBar(ctx, 0, 26, st.fillLevel, '#0284c7');
        break;
      }

      case 'bath_tub': {
        // Clawfoot bathtub
        ctx.fillStyle = '#ffffff';
        this.roundRect(ctx, -st.width / 2, -st.height / 2, st.width, st.height, 22);
        ctx.fill();
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 4;
        this.roundRect(ctx, -st.width / 2, -st.height / 2, st.width, st.height, 22);
        ctx.stroke();

        // Warm sudsy water
        ctx.fillStyle = '#67e8f9';
        this.roundRect(ctx, -st.width / 2 + 10, -st.height / 2 + 10, st.width - 20, st.height - 20, 15);
        ctx.fill();

        // Soap bubbles in tub
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        for (let bx = -25; bx <= 25; bx += 18) {
          ctx.beginPath();
          ctx.arc(bx, -4 + (bx % 6), 7, 0, Math.PI * 2);
          ctx.fill();
        }

        // Silver faucet
        ctx.fillStyle = '#64748b';
        ctx.fillRect(-st.width / 2 + 4, -8, 12, 16);
        ctx.beginPath();
        ctx.arc(-st.width / 2 + 16, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'grooming_table': {
        // Table top
        ctx.fillStyle = '#38bdf8';
        this.roundRect(ctx, -st.width / 2, -st.height / 2, st.width, st.height, 8);
        ctx.fill();
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 3;
        this.roundRect(ctx, -st.width / 2, -st.height / 2, st.width, st.height, 8);
        ctx.stroke();

        // Grooming brush & comb
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(-18, -6, 20, 10);
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(8, -4, 16, 6);
        break;
      }

      case 'nap_bed': {
        // Fluffy cushion
        ctx.fillStyle = '#f472b6';
        this.roundRect(ctx, -st.width / 2, -st.height / 2, st.width, st.height, 18);
        ctx.fill();
        ctx.strokeStyle = '#db2777';
        ctx.lineWidth = 3;
        this.roundRect(ctx, -st.width / 2, -st.height / 2, st.width, st.height, 18);
        ctx.stroke();

        // Inner fleece
        ctx.fillStyle = '#fbcfe8';
        this.roundRect(ctx, -st.width / 2 + 8, -st.height / 2 + 8, st.width - 16, st.height - 16, 12);
        ctx.fill();

        // Cute paw print in center of bed
        this.drawPawIcon(ctx, 0, 0, 10, '#ec4899');
        break;
      }

      case 'agility_hurdle': {
        // Red and white striped hurdle
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-st.width / 2, -5, st.width, 10);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-15, -5, 12, 10);
        ctx.fillRect(15, -5, 12, 10);

        // Posts
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(-st.width / 2, 0, 6, 0, Math.PI * 2);
        ctx.arc(st.width / 2, 0, 6, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'ball_rack': {
        // Wooden rack with tennis balls
        ctx.fillStyle = '#78350f';
        this.roundRect(ctx, -st.width / 2, -st.height / 2, st.width, st.height, 6);
        ctx.fill();

        // Tennis balls
        ctx.fillStyle = '#bef264';
        [-14, 0, 14].forEach((bx) => {
          ctx.beginPath();
          ctx.arc(bx, 0, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(bx, 0, 5, 0.4, Math.PI * 1.6);
          ctx.stroke();
        });
        break;
      }

      case 'treat_bar': {
        // Glass jar with cookies
        ctx.fillStyle = 'rgba(224, 242, 254, 0.85)';
        this.roundRect(ctx, -st.width / 2, -st.height / 2, st.width, st.height, 12);
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        this.roundRect(ctx, -st.width / 2, -st.height / 2, st.width, st.height, 12);
        ctx.stroke();

        // Golden bones
        ctx.fillStyle = '#f59e0b';
        this.drawBone(ctx, 0, -4, 14);
        this.drawBone(ctx, -8, 6, 12);
        this.drawBone(ctx, 8, 6, 12);
        break;
      }

      case 'poop_trash': {
        // Green waste bin
        ctx.fillStyle = '#15803d';
        this.roundRect(ctx, -st.width / 2, -st.height / 2, st.width, st.height, 8);
        ctx.fill();
        ctx.fillStyle = '#166534';
        this.roundRect(ctx, -st.width / 2 - 2, -st.height / 2 - 2, st.width + 4, 8, 3);
        ctx.fill();

        // Paw icon
        this.drawPawIcon(ctx, 0, 3, 6, '#bbf7d0');
        break;
      }
    }

    // Label
    ctx.fillStyle = '#451a03';
    ctx.font = '600 11px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(st.name, 0, st.height / 2 + 14);

    ctx.restore();
  }

  // --- Caretaker Rendering ---
  private drawCaretaker(ctx: CanvasRenderingContext2D, caretaker: Caretaker) {
    ctx.save();
    ctx.translate(caretaker.x, caretaker.y);

    // Soft Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.beginPath();
    ctx.ellipse(0, 18, 18, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Walking bounce
    const isMoving = Math.abs(caretaker.vx) > 0.1 || Math.abs(caretaker.vy) > 0.1;
    const bounce = isMoving ? Math.sin(caretaker.walkCycle * 8) * 3 : 0;
    const legSwing = isMoving ? Math.sin(caretaker.walkCycle * 8) * 8 : 0;

    ctx.translate(0, bounce);

    // Legs / Pants (Navy)
    ctx.fillStyle = '#1e3a5f';
    // Left leg
    ctx.fillRect(-10, 8, 8, 12 + legSwing);
    // Right leg
    ctx.fillRect(2, 8, 8, 12 - legSwing);

    // Shoes (White sneakers with orange trim)
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-11, 18 + legSwing, 10, 5);
    ctx.fillRect(1, 18 - legSwing, 10, 5);

    // Torso / Daycare Uniform Polo (Warm Coral Orange)
    ctx.fillStyle = '#ea580c';
    this.roundRect(ctx, -14, -14, 28, 22, 5);
    ctx.fill();

    // Apron (Crisp Teal with Paws logo)
    ctx.fillStyle = '#0d9488';
    this.roundRect(ctx, -10, -10, 20, 18, 3);
    ctx.fill();

    // Staff Paw Badge on Apron
    this.drawPawIcon(ctx, 0, -2, 4, '#ffffff');

    // Head (Peach skin)
    ctx.fillStyle = '#fcd34d';
    ctx.beginPath();
    ctx.arc(0, -24, 12, 0, Math.PI * 2);
    ctx.fill();

    // Hair (Brown cozy bun/tuft)
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(0, -29, 11, Math.PI, 0);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, -38, 6, 0, Math.PI * 2); // bun
    ctx.fill();

    // Eyes & Smile
    ctx.fillStyle = '#451a03';
    const lookX = caretaker.facing === 1 ? 2 : -2;
    ctx.beginPath();
    ctx.arc(-4 + lookX, -25, 1.8, 0, Math.PI * 2);
    ctx.arc(4 + lookX, -25, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Cheerful smile
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0 + lookX, -22, 3, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // Holding Item in Hand
    if (caretaker.holdingItem !== 'none') {
      const handX = caretaker.facing === 1 ? 16 : -16;
      const handY = -4;

      ctx.fillStyle = '#fcd34d';
      ctx.beginPath();
      ctx.arc(handX, handY, 4, 0, Math.PI * 2);
      ctx.fill();

      if (caretaker.holdingItem === 'ball') {
        ctx.fillStyle = '#bef264';
        ctx.beginPath();
        ctx.arc(handX + (caretaker.facing * 4), handY - 2, 7, 0, Math.PI * 2);
        ctx.fill();
      } else if (caretaker.holdingItem === 'kibble_scoop') {
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(handX - 2, handY - 8, 8, 12);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(handX - 1, handY - 9, 6, 4);
      } else if (caretaker.holdingItem === 'sponge') {
        ctx.fillStyle = '#facc15';
        ctx.fillRect(handX - 4, handY - 6, 12, 8);
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.beginPath();
        ctx.arc(handX + 2, handY - 10, 3, 0, Math.PI * 2);
        ctx.fill();
      } else if (caretaker.holdingItem === 'poop_scoop') {
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(handX, handY + 6);
        ctx.lineTo(handX + (caretaker.facing * 8), handY - 12);
        ctx.stroke();
        ctx.fillStyle = '#10b981';
        ctx.fillRect(handX + (caretaker.facing * 6), handY + 2, 8, 6);
      } else if (caretaker.holdingItem === 'treat') {
        ctx.fillStyle = '#f59e0b';
        this.drawBone(ctx, handX + (caretaker.facing * 4), handY, 8);
      }
    }

    ctx.restore();
  }

  // --- Dog Rendering with Breeds, Animations, & Expressions ---
  private drawDog(ctx: CanvasRenderingContext2D, dog: Dog, isSelected: boolean, isHovered: boolean) {
    ctx.save();
    ctx.translate(dog.x, dog.y);

    // Selection ring / hover halo
    if (isSelected) {
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(0, 14, 24, 12, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (isHovered) {
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 14, 22, 11, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(0, 14, 20, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Facing direction & animations
    ctx.scale(dog.facing, 1);

    const isMoving = Math.abs(dog.vx) > 0.05 || Math.abs(dog.vy) > 0.05;
    const isSleeping = dog.state === 'sleeping';
    const isEating = dog.state === 'eating';

    // Squash & stretch walk bounce
    const walkBob = isMoving ? Math.sin(dog.walkCycle * 10) * 3 : 0;
    const sleepBreath = isSleeping ? Math.sin(Date.now() / 600) * 2 : 0;

    ctx.translate(0, walkBob + sleepBreath);

    // Render legs
    if (!isSleeping) {
      this.drawDogLegs(ctx, dog, isMoving);
    }

    // Render Breed Body & Markings
    this.drawDogBody(ctx, dog, isSleeping);

    // Render Tail (Animated wagging)
    this.drawDogTail(ctx, dog);

    // Render Head, Ears, and Face
    this.drawDogHead(ctx, dog, isSleeping, isEating);

    // Muddy overlay if low cleanliness
    if (dog.isMuddy || dog.needs.cleanliness < 40) {
      ctx.fillStyle = 'rgba(120, 53, 15, 0.6)';
      ctx.beginPath();
      ctx.arc(6, 0, 5, 0, Math.PI * 2);
      ctx.arc(-8, 4, 4, 0, Math.PI * 2);
      ctx.arc(10, -12, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Restore un-mirrored context for HUD bubble & Name Tag
    ctx.restore();

    // Draw Floating Need Bubble & Name Tag above dog (unmirrored)
    this.drawDogOverheadHUD(ctx, dog);
  }

  private drawDogLegs(ctx: CanvasRenderingContext2D, dog: Dog, isMoving: boolean) {
    ctx.fillStyle = dog.color;
    const legSwing = isMoving ? Math.sin(dog.walkCycle * 10) * 5 : 0;

    // Short legs for Corgi/Frenchie, longer for Golden/Dalmatian
    const legLength = (dog.breed === 'corgi' || dog.breed === 'frenchie') ? 7 : 12;

    // Back legs
    ctx.fillRect(-14 - legSwing, 6, 6, legLength);
    ctx.fillRect(8 + legSwing, 6, 6, legLength);

    // Front paws
    ctx.fillRect(-10 + legSwing, 6, 6, legLength);
    ctx.fillRect(12 - legSwing, 6, 6, legLength);
  }

  private drawDogBody(ctx: CanvasRenderingContext2D, dog: Dog, isSleeping: boolean) {
    ctx.fillStyle = dog.color;

    if (isSleeping) {
      // Curled up sleeping loaf
      this.roundRect(ctx, -18, -4, 36, 20, 10);
      ctx.fill();
    } else {
      // Standing / running body
      this.roundRect(ctx, -16, -10, 34, 20, 10);
      ctx.fill();

      // Breed specific body markings
      if (dog.breed === 'corgi' || dog.breed === 'shiba') {
        // Cream underbelly
        ctx.fillStyle = '#fffbeb';
        this.roundRect(ctx, -10, 0, 24, 10, 5);
        ctx.fill();
      } else if (dog.breed === 'dalmatian') {
        // Dalmatian spots
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(-8, -4, 2.5, 0, Math.PI * 2);
        ctx.arc(2, 2, 3, 0, Math.PI * 2);
        ctx.arc(8, -6, 2, 0, Math.PI * 2);
        ctx.arc(-2, -8, 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (dog.breed === 'poodle') {
        // Poodle back puff
        ctx.fillStyle = dog.color;
        ctx.beginPath();
        ctx.arc(-14, -6, 7, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  private drawDogTail(ctx: CanvasRenderingContext2D, dog: Dog) {
    ctx.save();
    ctx.translate(-16, -4);

    const wag = Math.sin(Date.now() / 100 * dog.tailWagSpeed + dog.tailWagOffset) * (0.3 + (dog.needs.happiness / 100) * 0.5);
    ctx.rotate(wag - 0.4);

    ctx.fillStyle = dog.color;

    if (dog.breed === 'corgi') {
      // Cute stubby little wagging loaf tail
      ctx.beginPath();
      ctx.arc(-4, 0, 5, 0, Math.PI * 2);
      ctx.fill();
    } else if (dog.breed === 'frenchie') {
      // Small button tail
      ctx.beginPath();
      ctx.arc(-3, 0, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (dog.breed === 'shiba') {
      // Curled donut tail
      ctx.lineWidth = 5;
      ctx.strokeStyle = dog.color;
      ctx.beginPath();
      ctx.arc(-6, -6, 7, 0, Math.PI * 1.8);
      ctx.stroke();
    } else if (dog.breed === 'poodle') {
      // Pom-pom tail
      ctx.lineWidth = 3;
      ctx.strokeStyle = dog.color;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-12, -8);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-14, -10, 5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Bushy golden / dalmatian wagging tail
      ctx.lineWidth = 5;
      ctx.strokeStyle = dog.color;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-14, -10, -20, -6);
      ctx.stroke();
    }

    ctx.restore();
  }

  private drawDogHead(ctx: CanvasRenderingContext2D, dog: Dog, isSleeping: boolean, isEating: boolean) {
    ctx.save();
    // Head positioned forward
    const headX = isSleeping ? 10 : 16;
    const headY = isSleeping ? 0 : (isEating ? 4 : -14);
    ctx.translate(headX, headY);

    // Head base
    ctx.fillStyle = dog.color;
    ctx.beginPath();
    ctx.arc(0, 0, 11, 0, Math.PI * 2);
    ctx.fill();

    // Muzzle / Snout
    ctx.fillStyle = dog.breed === 'frenchie' ? '#334155' : (dog.breed === 'shiba' ? '#fffbeb' : dog.color);
    const snoutLength = dog.breed === 'frenchie' ? 4 : 8;
    this.roundRect(ctx, 4, -3, snoutLength, 8, 3);
    ctx.fill();

    // Nose (black button)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(4 + snoutLength, -1, 2, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    if (isSleeping) {
      // Sleepy closed happy curves ^-^
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(2, -4, 3, Math.PI, 0);
      ctx.stroke();
    } else {
      // Alert glossy eyes
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(3, -4, 2.5, 0, Math.PI * 2);
      ctx.fill();
      // Eye sparkle
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(3.8, -4.8, 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Mouth / Tongue (panting if happy or barking)
    if (dog.isBarking || dog.needs.happiness > 65) {
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(6, 3, 3, 0, Math.PI);
      ctx.fill();
    }

    // Ears (breed specific)
    ctx.fillStyle = dog.earColor || dog.color;

    if (dog.breed === 'corgi' || dog.breed === 'shiba') {
      // Pointed upright triangular ears
      ctx.beginPath();
      ctx.moveTo(-6, -8);
      ctx.lineTo(-2, -22);
      ctx.lineTo(4, -8);
      ctx.fill();

      // Inner ear pink
      ctx.fillStyle = '#fbcfe8';
      ctx.beginPath();
      ctx.moveTo(-4, -8);
      ctx.lineTo(-2, -18);
      ctx.lineTo(2, -8);
      ctx.fill();
    } else if (dog.breed === 'frenchie') {
      // Bat ears (tall rounded)
      this.roundRect(ctx, -5, -20, 9, 14, 4);
      ctx.fill();
      ctx.fillStyle = '#fbcfe8';
      this.roundRect(ctx, -3, -18, 5, 10, 2);
      ctx.fill();
    } else if (dog.breed === 'poodle') {
      // Poodle puffy topknot + fluffy drop ears
      ctx.beginPath();
      ctx.arc(0, -11, 7, 0, Math.PI * 2); // top puff
      ctx.fill();
      // Drop ear
      ctx.beginPath();
      ctx.arc(-6, -2, 6, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Golden Retriever / Dalmatian floppy ears
      ctx.beginPath();
      ctx.ellipse(-6, -2, 5, 10, -0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // Overhead Need Icons and Name Display
  private drawDogOverheadHUD(ctx: CanvasRenderingContext2D, dog: Dog) {
    ctx.save();
    ctx.translate(dog.x, dog.y - 36);

    // Urgent Need Bubble
    const urgentNeed = this.getPrimaryUrgentNeed(dog);
    if (urgentNeed) {
      // Floating bubble
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 6;
      this.roundRect(ctx, -14, -22, 28, 22, 10);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Pointer
      ctx.beginPath();
      ctx.moveTo(-4, 0);
      ctx.lineTo(0, 4);
      ctx.lineTo(4, 0);
      ctx.fill();

      // Render need icon inside bubble
      this.drawNeedIcon(ctx, 0, -11, urgentNeed);
    }

    // Dog Name Badge
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    const textWidth = ctx.measureText(dog.name).width;
    this.roundRect(ctx, -textWidth / 2 - 6, 2, textWidth + 12, 16, 8);
    ctx.fill();

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 10px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(dog.name, 0, 14);

    ctx.restore();
  }

  private getPrimaryUrgentNeed(dog: Dog): string | null {
    if (dog.isBarking) return 'bark';
    if (dog.needs.hunger < 35) return 'hunger';
    if (dog.needs.thirst < 35) return 'thirst';
    if (dog.needs.cleanliness < 35) return 'bath';
    if (dog.needs.energy < 30) return 'sleep';
    if (dog.needs.potty < 30) return 'potty';
    if (dog.needs.happiness < 40) return 'play';
    if (dog.needs.happiness > 80 && Math.random() < 0.2) return 'love';
    return null;
  }

  private drawNeedIcon(ctx: CanvasRenderingContext2D, x: number, y: number, need: string) {
    switch (need) {
      case 'hunger': // Bone
        ctx.fillStyle = '#d97706';
        this.drawBone(ctx, x, y, 10);
        break;
      case 'thirst': // Water drop
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.arc(x, y + 2, 4, 0, Math.PI);
        ctx.lineTo(x, y - 5);
        ctx.closePath();
        ctx.fill();
        break;
      case 'bath': // Soap bubbles
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(x - 2, y, 4, 0, Math.PI * 2);
        ctx.arc(x + 3, y - 2, 3, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'sleep': // Zzz
        ctx.fillStyle = '#6366f1';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Zz', x, y + 4);
        break;
      case 'potty': // Sweatdrop
        ctx.fillStyle = '#eab308';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('!', x, y + 4);
        break;
      case 'play': // Tennis ball
        ctx.fillStyle = '#84cc16';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'love': // Heart
        this.drawHeart(ctx, x, y, 8, '#f43f5e');
        break;
      case 'bark': // Exclamation
        ctx.fillStyle = '#ea580c';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Woof!', x, y + 4);
        break;
    }
  }

  // --- Tennis Ball Drawing ---
  private drawTennisBall(ctx: CanvasRenderingContext2D, ball: TennisBall) {
    ctx.save();
    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(ball.x, ball.y, 6, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ball with height offset
    const ballY = ball.y - ball.z;
    ctx.fillStyle = '#bef264';
    ctx.beginPath();
    ctx.arc(ball.x, ballY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Curved seam
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(ball.x - 1, ballY, 4, 0.4, Math.PI * 1.6);
    ctx.stroke();

    ctx.restore();
  }

  // --- Poop Mess Drawing ---
  private drawPoop(ctx: CanvasRenderingContext2D, poop: PoopMess) {
    if (poop.cleaned) return;
    ctx.save();
    ctx.translate(poop.x, poop.y);

    ctx.fillStyle = '#713f12';
    // Swirled soft pile
    ctx.beginPath();
    ctx.arc(-4, 0, 5, 0, Math.PI * 2);
    ctx.arc(4, 0, 5, 0, Math.PI * 2);
    ctx.arc(0, -5, 4, 0, Math.PI * 2);
    ctx.arc(0, -8, 2, 0, Math.PI * 2);
    ctx.fill();

    // Animated little fly buzz
    const flyX = Math.sin(Date.now() / 150) * 8;
    const flyY = -14 + Math.cos(Date.now() / 150) * 4;
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(flyX, flyY, 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // --- Target Click Ring ---
  private drawTargetClick(ctx: CanvasRenderingContext2D, target: { x: number; y: number; time: number }) {
    const elapsed = Date.now() - target.time;
    const progress = elapsed / 800;
    const radius = 6 + progress * 18;
    const alpha = Math.max(0, 1 - progress);

    ctx.save();
    ctx.strokeStyle = `rgba(245, 158, 11, ${alpha})`;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(target.x, target.y, radius, 0, Math.PI * 2);
    ctx.stroke();

    this.drawPawIcon(ctx, target.x, target.y, 6, `rgba(245, 158, 11, ${alpha})`);
    ctx.restore();
  }

  // --- Particle System ---
  private drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
    particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = p.alpha;

      if (p.type === 'heart') {
        this.drawHeart(ctx, p.x, p.y, p.size, p.color);
      } else if (p.type === 'bubble') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
      } else if (p.type === 'zzz') {
        ctx.fillStyle = p.color;
        ctx.font = `bold ${Math.round(p.size)}px "Outfit", sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(p.text || 'Z', p.x, p.y);
      } else if (p.type === 'crumb') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'star') {
        ctx.fillStyle = p.color;
        this.drawStar(ctx, p.x, p.y, 4, p.size, p.size / 2);
      }

      ctx.restore();
    });
  }

  // --- Shape Utilities ---
  private roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  private drawBone(ctx: CanvasRenderingContext2D, x: number, y: number, length: number) {
    ctx.save();
    ctx.translate(x, y);
    const half = length / 2;
    ctx.lineWidth = 3;
    ctx.strokeStyle = ctx.fillStyle;
    ctx.beginPath();
    ctx.moveTo(-half + 2, 0);
    ctx.lineTo(half - 2, 0);
    ctx.stroke();

    [-half, half].forEach((bx) => {
      ctx.beginPath();
      ctx.arc(bx, -2.5, 2.5, 0, Math.PI * 2);
      ctx.arc(bx, 2.5, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  private drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
    ctx.fillStyle = color;
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 2, x, y + size);
    ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 2, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    ctx.closePath();
    ctx.fill();
  }

  private drawPawIcon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
    ctx.fillStyle = color;
    // Main pad
    ctx.beginPath();
    ctx.arc(x, y + size * 0.3, size * 0.5, 0, Math.PI * 2);
    ctx.fill();

    // 4 toe pads
    const toeR = size * 0.22;
    ctx.beginPath();
    ctx.arc(x - size * 0.45, y - size * 0.2, toeR, 0, Math.PI * 2);
    ctx.arc(x - size * 0.16, y - size * 0.5, toeR, 0, Math.PI * 2);
    ctx.arc(x + size * 0.16, y - size * 0.5, toeR, 0, Math.PI * 2);
    ctx.arc(x + size * 0.45, y - size * 0.2, toeR, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  }

  private drawMiniFillBar(ctx: CanvasRenderingContext2D, x: number, y: number, pct: number, color: string) {
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    this.roundRect(ctx, x - 18, y, 36, 6, 3);
    ctx.fill();

    const w = Math.max(0, Math.min(36, (pct / 100) * 36));
    ctx.fillStyle = pct < 20 ? '#ef4444' : color;
    this.roundRect(ctx, x - 18, y, w, 6, 3);
    ctx.fill();
  }
}
