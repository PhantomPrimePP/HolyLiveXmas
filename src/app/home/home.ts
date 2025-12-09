import { AfterViewInit, Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { GiftUpload } from '../gift-upload/gift-upload';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [RouterLink, RouterModule, GiftUpload, NgIf],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, AfterViewInit {

  constructor(private dialog: MatDialog) {}

  @ViewChild('bgVideo') bgVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('bgMusic') bgMusic!: ElementRef<HTMLAudioElement>;

  currentPage = 1;

  // INITIAL VOLUME (20%)
  volume = 8;

  // ensures music unlock listener only attaches once
  private musicUnlockAdded = false;

  ngOnInit() {
    // Nothing here — autoplay must wait until view is ready
  }

  ngAfterViewInit() {
    this.setupMusic();     // safe autoplay + one-time unlock
    this.tryStartVideo();  // video autoplay fix
  }

  // -----------------------------
  // NAVIGATION
  // -----------------------------
  goToPage(n: number) {
    this.currentPage = n;
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
  changeVolume(event: any) {
    const music = this.bgMusic?.nativeElement;
    if (!music) return;

    this.volume = event.target.value;
    music.volume = this.volume / 100;
  }
}
