import { AfterViewInit, Component, ElementRef, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { GiftUpload } from '../gift-upload/gift-upload';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { Birthday } from "../birthday/birthday";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RouterModule, GiftUpload, NgIf, Birthday],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, AfterViewInit {

  constructor(private dialog: MatDialog, private cdr: ChangeDetectorRef) {}


  @ViewChild('bgVideo') bgVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('bgMusic') bgMusic!: ElementRef<HTMLAudioElement>;

  currentPage = 1;
 pageFor: 'Misa' | 'Jade' | 'Phy' | 'Amber'= 'Misa' ;
  // INITIAL VOLUME (20%)
  volume = 8;

isFadingOut = false;
isFadingIn = false;
showPage = true; // controls *ngIf rendering
fadeDuration = 400;

  // ensures music unlock listener only attaches once
  private musicUnlockAdded = false;


 ngAfterViewInit() {
  this.setupMusic();
  this.tryStartVideo();

  // ❌ REMOVE this
  // this.startVideoSlideshow();

  // ✅ START ONLY IF WE ARE ON PAGE 1
  if (this.currentPage === 1) {
    this.startVideoSlideshow();
  }
}

  // -----------------------------
  // NAVIGATION
  // -----------------------------
goToPage(page: number) {
  if (this.currentPage !== page) {
    this.pageHistory.push(this.currentPage);
    this.currentPage = page;

    if (page === 1 || page === 7) {
      this.startVideoSlideshow();
    } else {
      this.stopVideoSlideshow();
    }

    this.cdr.detectChanges();
  }
}




  // -----------------------------
  // OPEN GIFT UPLOAD DIALOG
  // -----------------------------
  openGiftUpload() {
    this.dialog.open(GiftUpload, { width: '500px' });
  }

  // -----------------------------
  // VIDEO AUTOPLAY FIX
  // -----------------------------
  private tryStartVideo() {
    if (!this.bgVideo) return;

    const vid = this.bgVideo.nativeElement;
    vid.muted = true;

    vid.play().catch(() => {
      console.log("Video autoplay blocked, retrying...");
      setTimeout(() => vid.play().catch(() => {}), 400);
    });
  }

  // -----------------------------
  // AUDIO SETUP + AUTOPLAY + UNLOCK
  // -----------------------------
private setupMusic() {
  if (!this.bgMusic) return;

  const music = this.bgMusic.nativeElement;
  const trackGain = this.playlist[this.currentTrackIndex].gain;
music.volume = (this.volume / 100) * trackGain;

  music.addEventListener('ended', () => {
    this.playNextTrack();
  });

  music.play().catch(() => {});

  if (!this.musicUnlockAdded) {
    this.musicUnlockAdded = true;

    window.addEventListener(
      'click',
      () => music.play().catch(() => {}),
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

  if (!this.bgMusic?.nativeElement) return;

  const music = this.bgMusic.nativeElement;
  const trackGain = this.playlist[this.currentTrackIndex].gain;

  music.volume = (this.volume / 100) * trackGain;

  if (music.paused) {
    music.play().catch(() => {});
  }
}



// Optional: close when clicking elsewhere
  ngOnInit() {
    document.addEventListener('click', () => {
      this.volumeOpen = false;
    });
  }

leftIndex = 0;
rightIndex = 0;
isSliding = false;

leftImages = [
  'Pictures/Misa_11.png',
  'Pictures/Misa1.png',
  'Pictures/Misa2.jpg',
  'Pictures/Misa3.jpg',
  'Pictures/Misa4.jpg',
  'Pictures/Misa5.jpg'
];

rightImages = [
  'Pictures/Misa6.png',
  'Pictures/Misa7.png',
  'Pictures/Misa8.png',
  'Pictures/Misa9.png',
  'Pictures/Misa10.png'
];
private slideshowInterval: any = null;

 startVideoSlideshow() {
  setInterval(() => {
    if (this.currentPage !== 1) return;

    // 🔊 ENSURE MUSIC IS PLAYING
    const music = this.bgMusic?.nativeElement;
    if (music && music.paused) {
      music.play().catch(() => {});
    }

    this.isSliding = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.leftIndex = (this.leftIndex + 1) % this.leftImages.length;
      this.rightIndex = (this.rightIndex + 1) % this.rightImages.length;

      this.isSliding = false;
      this.cdr.detectChanges();
    }, 900);
  }, 5000);
}

stopVideoSlideshow() {
  if (this.slideshowInterval) {
    clearInterval(this.slideshowInterval);
    this.slideshowInterval = null;
  }
}
isMisaCardOpen = false;

toggleMisaCard() {
  this.isMisaCardOpen = !this.isMisaCardOpen;
}


playlist = [
  {
    name: 'Chrismtas singer',
    song: 'Idk picked it up for free',
    audio: 'Pictures/Christmas-Music3.mp3',
    avatar: 'Pictures/PP.png',
    gain: 0.1
  },
  {
    name: 'Randomguy__',
    song: 'All I want for Christmas is You',
    audio: 'Pictures/Kyle_All-I-Want.wav',
    avatar: 'Pictures/Kinsely_Tree.gif',
    gain: 0.5
  },
  {
    name: 'Taynathon',
    song: 'Jingle Bells Rock',
    audio: 'Pictures/Tay_JingleBells.wav',
    avatar: 'Pictures/Tay_Tree.gif',
    gain: 0.5
  },
  {
    name: 'Butt Juice',
    song: 'Feliz Navidad',
    audio: 'Pictures/BuhJuice_FelizNavidad.mp3',
    avatar: 'Pictures/ButtJuice_Tree.gif',
    gain: 0.5
  },
  {
    name: 'Xenia',
    song: 'Santa Tell Me',
    audio: 'Pictures/Xenia_SantaTellMe.m4a',
    avatar: 'Pictures/XEN_PLUSHIE.png',
    gain: 0.5
  }
];

currentTrackIndex = 0;

playNextTrack() {
  this.currentTrackIndex =
    (this.currentTrackIndex + 1) % this.playlist.length;

  this.cdr.detectChanges(); // 🔥 IMPORTANT

  const music = this.bgMusic.nativeElement;
  const trackGain = this.playlist[this.currentTrackIndex].gain;

  music.volume = (this.volume / 100) * trackGain;

  music.play().catch(() => {});
}

pageHistory: number[] = [];
goBack() {
  if (this.pageHistory.length > 0) {
    this.currentPage = this.pageHistory.pop()!;
  }
}
playPrevTrack() {
  this.currentTrackIndex =
    (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;

  this.cdr.detectChanges();

  const music = this.bgMusic.nativeElement;
  const trackGain = this.playlist[this.currentTrackIndex].gain;

  music.volume = (this.volume / 100) * trackGain;
  music.play().catch(() => {});
}


}
