import { NgIf } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-special-kyle',
  imports: [NgIf, FormsModule],
  templateUrl: './special-kyle.html',
  styleUrl: './special-kyle.scss',
})
export class SpecialKyle implements OnInit , AfterViewInit, OnDestroy{
    constructor(private dialog: MatDialog, private cdr: ChangeDetectorRef, private router: Router) {}

 private musicUnlockAdded = false;


 @ViewChild('bgMusic') bgMusic!: ElementRef<HTMLAudioElement>;

volume = 50;
 ngAfterViewInit() {
    this.setupMusic();     // safe autoplay + one-time unlock
    this.startCenterSlideshow();
  }

  private setupMusic() {
    if (!this.bgMusic) return;

    const music = this.bgMusic.nativeElement;

    // Start at slider's default volume
    music.volume = this.volume / 100;

    // Try autoplay immediately
    music.play().catch(() => {
      console.log("Music autoplay blocked — waiting for interaction.");
    });

    // Add ONE click listener globally (never more than one)
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

  // -----------------------------
  // VOLUME SLIDER CONTROL
  // -----------------------------
toggleVolume(event: MouseEvent) {
  event.stopPropagation(); // prevent closing immediately
  this.volumeOpen = !this.volumeOpen;
}
volumeOpen = false;
changeVolume(event: any) {
  this.volume = Number(event.target.value);

  if (this.bgMusic?.nativeElement) {
    this.bgMusic.nativeElement.volume = this.volume / 100;
  }
}



    ngOnInit() {
    document.addEventListener('click', () => {
      this.volumeOpen = false;
    });
  }

centerIndex = 0;
rightIndex = 0;
isSliding = false;

centerImages = [
  'Pictures/Misa_Beloved.gif',
  'Pictures/Misa_11.png',
  'Pictures/Misa1.png',
  'Pictures/Misa2.jpg',
  'Pictures/Misa3.jpg',
  'Pictures/Misa4.jpg',
  'Pictures/Misa5.jpg',
  'Pictures/Misa6.png',
  'Pictures/Misa7.png',
  'Pictures/Misa8.png',
  'Pictures/Misa9.png',
  'Pictures/Misa10.png'
];

rightImages = [
  
];

 startCenterSlideshow() {
  setInterval(() => {

    // 🔊 ENSURE MUSIC IS PLAYING
    const music = this.bgMusic?.nativeElement;
    if (music && music.paused) {
      music.play().catch(() => {});
    }

    this.isSliding = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.centerIndex = (this.centerIndex + 1) % this.centerImages.length;

      this.isSliding = false;
      this.cdr.detectChanges();
    }, 900);

  }, 5000);
}


showQuiz = false;

answerHeight = '';
answerAge = '';
answerWuwa = '';

errorText = '';

openQuiz() {
  this.showQuiz = true;
  this.errorText = '';
}

closeQuiz() {
  this.showQuiz = false;
}

submitQuiz() {
  const height = Number(this.answerHeight);
  const age = Number(this.answerAge);

  // normalize wuwa answer
  const wuwa = this.answerWuwa
    .toLowerCase()
    .replace(/[^a-z]/g, '');

  if (isNaN(height) || height <= 1000) {
    this.errorText = 'Height is incorrect.';
    return;
  }

  if (isNaN(age) || age <= 1000) {
    this.errorText = 'Age is incorrect.';
    return;
  }

  if (wuwa !== 'shorekeeper') {
    this.errorText = 'Wuwa wife is incorrect.';
    return;
  }

  // ✅ ALL CORRECT
  this.showQuiz = false;
  this.router.navigate(['/end']);
}

ngOnDestroy() {
  if (this.bgMusic?.nativeElement) {
    const music = this.bgMusic.nativeElement;
    music.pause();
    music.currentTime = 0; // reset to start
  }
}

}
