import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GiftService } from '../services/gift.service';
import { GiftViewer } from '../gift-viewer/gift-viewer';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [CommonModule, GiftViewer],
  templateUrl: './room.html',
  styleUrl: './room.scss'
})
export class Room implements OnInit {
  gifts: any[] = [];
  giftPositions: { x: number; y: number }[] = [];

  // map the friendly name (what you save from upload) to the public image file in /public
  giftBoxLookup = [
    { name: 'Box 1', image: '/Box1.png' },
    { name: 'Box 2', image: '/Box2.png' },
    { name: 'Box 3', image: '/Box3.png' },
    { name: 'Box 4', image: '/Box4.png' },
    { name: 'Box 5', image: '/Box5.png' },
    { name: 'Box 6', image: '/Box6.png' },
    { name: 'Box 7', image: '/Box7.png' },
    { name: 'Box 8', image: '/Box8.png' },
  ];

  constructor(private giftService: GiftService, private dialog: MatDialog) {}

  async ngOnInit() {
    this.gifts = await this.giftService.getAllGifts();
    console.log('Loaded gifts:', this.gifts);
    await this.refreshGifts();

    // Generate positions only for bottom half area (we treat the bottom container height as 100%)
    this.giftPositions = this.generateGiftPositions(this.gifts.length);
    console.log('Generated gift positions:', this.giftPositions);
  }

  // generate evenly-distributed X positions and random Y within a narrow band (floor)
  generateGiftPositions(count: number) {
  const positions: { x: number; y: number }[] = [];
  if (count === 0) return positions;

  const boxesPerRow = 10;
  const xSpacing = 100 / (boxesPerRow + 1); // horizontal spacing pe percentage
  const ySpacing = 12; // percentage from top for each row (adjustable)

  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / boxesPerRow);
    const col = i % boxesPerRow;

    const x = (col + 1) * xSpacing;
    const y = 10 + row * ySpacing; // first row at 10%, next at 22%, etc.

    positions.push({ x, y });
  }

  return positions;
}


  // returns the correct src for the gift box icon:
  // - if gift.BoxImage looks like a stored filename or key (e.g. "Box 1") -> map to public /Box1.png
  // - if gift.BoxImage is already a URL (contains http or starts with /) -> return as-is
  getBoxImageSrc(gift: any) {
    if (!gift) return '';
    const v = gift.BoxImage ?? gift.boxImage ?? gift.boximage ?? '';

    // if it's a full URL or starts with "/" use it directly
    if (typeof v === 'string' && (v.startsWith('http') || v.startsWith('/'))) return v;

    // otherwise, find mapping by friendly name
    const found = this.giftBoxLookup.find(g => g.name.toLowerCase() === String(v).toLowerCase());
    if (found) return found.image;

    // fallback: try to build a public path from the name, e.g. "Box1.png"
    const quick = `/Box${(String(v).replace(/[^0-9]/g, '') || '')}.png`;
    return quick;
  }

openGift(gift: any) {
   this.spawnConfetti(gift);
  this.dialog.open(GiftViewer, {
    width: '600px',
    
    data: {
      name: gift.Name,
      url: gift.FileURL,
      type: gift.FileType,
       message: gift.Message
    }
  });
}


  async refreshGifts() {
  console.log("Refreshing gifts...");

  this.gifts = await this.giftService.getAllGifts();

  this.giftPositions = this.generateGiftPositions(this.gifts.length);

  console.log('Refreshed gifts:', this.gifts);
  console.log('New positions:', this.giftPositions);
}
spawnConfetti(gift: any) {
  const container = document.querySelector('.confetti-container') as HTMLElement;
  if (!container) return;

  const index = this.gifts.indexOf(gift);
  const pos = this.giftPositions[index];

  // Convert percentage to pixel position
  const rect = container.getBoundingClientRect();
  const x = (pos.x / 100) * rect.width;
  const y = (pos.y / 100) * rect.height;

  // Create 20 confetti pieces
  for (let i = 0; i < 20; i++) {
    const piece = document.createElement('div');
    piece.classList.add('confetti-piece');

    // Random color
    const colors = ['#ff4d4d', '#ffcc00', '#00ccff', '#66ff66', '#ff66ff'];
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];

    // Random spread
    const offsetX = (Math.random() - 0.5) * 80;  // left-right spread
    const offsetY = (Math.random() - 0.5) * 50;  // upward burst

    piece.style.left = `${x + offsetX}px`;
    piece.style.top = `${y + offsetY}px`;

    container.appendChild(piece);

    // Remove after animation ends
    setTimeout(() => {
      container.removeChild(piece);
    }, 700);
  }
}

}
