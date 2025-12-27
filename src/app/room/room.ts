import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

   @ViewChild('bgMusic') bgMusic!: ElementRef<HTMLAudioElement>;

    ngAfterViewInit() {
    this.setupMusic();     // safe autoplay + one-time unlock
  }

  // map the friendly name (what you save from upload) to the public image file in /public
giftBoxLookup = [
  { name: 'Box 1', image: 'boxes/Box1.png' },
  { name: 'Box 2', image: 'boxes/Box2.png' },
  { name: 'Box 3', image: 'boxes/Box3.png' },
  { name: 'Box 4', image: 'boxes/Box4.png' },
  { name: 'Box 5', image: 'boxes/Box5.png' },
  { name: 'Box 6', image: 'boxes/Box6.png' },
  { name: 'Box 7', image: 'boxes/Box7.png' },
  { name: 'Box 8', image: 'boxes/Box8.png' },
];


  constructor(private giftService: GiftService, private dialog: MatDialog) {}

  async ngOnInit() {
    //this.gifts = await this.giftService.getAllGifts();
 //   console.log('Loaded gifts:', this.gifts);
  //  await this.refreshGifts();

    // Generate positions only for bottom half area (we treat the bottom container height as 100%)
 //   this.giftPositions = this.generateGiftPositions(this.gifts.length);
 //   console.log('Generated gift positions:', this.giftPositions);
   const raw = this.giftService.getAllGifts();

  // 🔑 UNWRAP the real gifts array
  this.gifts = Array.isArray(raw) && raw[0]?.gifts
    ? raw[0].gifts
    : raw;

  this.giftPositions = this.generateGiftPositions(this.gifts.length);

  console.log('Final gifts array:', this.gifts);
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
  if (!gift) return 'boxes/Box1.png';

  const v = gift.BoxImage ?? '';

  // If JSON already contains a filename like "Box3.png"
  if (typeof v === 'string' && v.endsWith('.png')) {
    return `boxes/${v}`;
  }

  // Friendly name lookup ("Box 3")
  const found = this.giftBoxLookup.find(
    g => g.name.toLowerCase() === String(v).toLowerCase()
  );

  if (found) return found.image;

  // Final fallback
  return 'boxes/Box1.png';
}





openGift(gift: any, index: number, event?: MouseEvent) {
  const element = event?.currentTarget as HTMLElement;
  if (!element) return;

  element.classList.add('gift-opening', 'gift-glow');
  this.lowerBackgroundMusic();

  setTimeout(() => {

    const isYouTube = gift.FileType === 'youtube';

    const dialogRef = this.dialog.open(GiftViewer, {
      width: isYouTube ? '92vw' : '600px',
      maxWidth: isYouTube ? '600px' : '90vw',

      // ❌ DO NOT force height for video
      maxHeight: '92vh',

      panelClass: 'gift-viewer-dialog',
      autoFocus: false,

      data: {
        name: gift.Name,
        url: gift.FileURL,
        type: gift.FileType ?? 'message',  
        message: gift.Message
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.restoreBackgroundMusic();
    });

  }, 350);
}





  async refreshGifts() {
  console.log("Refreshing gifts...");

  this.gifts = await this.giftService.getAllGifts();

  this.giftPositions = this.generateGiftPositions(this.gifts.length);

  console.log('Refreshed gifts:', this.gifts);
  console.log('New positions:', this.giftPositions);
}


playRandomGiftSound() {
  const sounds = [
    "Pictures/GiftSound1.mp3",
    "Pictures/GiftSound2.mp3"
  ];

  // Pick random index (0 or 1)
  const randomSound = sounds[Math.floor(Math.random() * sounds.length)];

  const audio = new Audio(randomSound);
  audio.volume = 0.8; // adjust loudness
  audio.play().catch(err => console.warn("Sound play blocked:", err));
}
volume = 5;
bgVolumeDucked = 0; 
volumeOpen = false;
private musicUnlockAdded = false;


 private setupMusic() {
  if (!this.bgMusic) return;

  const music = this.bgMusic.nativeElement;

  // 🔊 Start at slider's default volume
 const trackGain = this.bgPlaylist[this.currentBgIndex].gain;
music.volume = (this.volume / 100) * trackGain;

  // ▶️ Try autoplay immediately
  music.play().catch(() => {
    console.log("Music autoplay blocked — waiting for interaction.");
  });

  // 🔁 Play next song when current ends
  music.addEventListener('ended', () => {
    this.playNextBgTrack();
  });

  // 🖱️ Add ONE click listener globally (never more than one)
  if (!this.musicUnlockAdded) {
    this.musicUnlockAdded = true;

    window.addEventListener(
      'click',
      () => {
        music.play().catch(() => {});
      },
      { once: true }
    );
  }
}


lowerBackgroundMusic() {
  const music = document.querySelector('audio') as HTMLAudioElement;
  if (!music) return;

  music.volume = this.bgVolumeDucked / 100; // ✅ FIX
}
restoreBackgroundMusic() {
  const music = document.querySelector('audio') as HTMLAudioElement;
  if (!music) return;

  music.volume = this.volume / 100; // ✅ FIX
}

toggleVolume(event: MouseEvent) {
  event.stopPropagation(); // prevent closing immediately
  this.volumeOpen = !this.volumeOpen;
}

changeVolume(event: any) {
  this.volume = Number(event.target.value);

  if (this.bgMusic?.nativeElement) {
    const music = this.bgMusic.nativeElement;
    const trackGain = this.bgPlaylist[this.currentBgIndex].gain;
    music.volume = (this.volume / 100) * trackGain;
  }
}

// Optional: close when clicking elsewhere
ngOnInIt() {
  document.addEventListener('click', () => {
    this.volumeOpen = false;
  });
}

bgPlaylist = [
   {src: 'Pictures/Christmas-Music.mp3', gain: 0.5 },
  {src:'Pictures/Christmas-Music5.mp3', gain: 0.5},
  {src:'Pictures/Christmas-Music2.mp3', gain: 0.5},
  {src:'Pictures/Christmas-Music3.mp3', gain: 0.1},
  {src:'Pictures/Christmas-Music4.mp3', gain: 0.5},
];

currentBgIndex = 0;
playNextBgTrack() {
  this.currentBgIndex =
    (this.currentBgIndex + 1) % this.bgPlaylist.length;

  const music = this.bgMusic.nativeElement;
music.src = this.bgPlaylist[this.currentBgIndex].src;
const trackGain = this.bgPlaylist[this.currentBgIndex].gain;
music.volume = (this.volume / 100) * trackGain;
  music.play().catch(() => {});
}

}
