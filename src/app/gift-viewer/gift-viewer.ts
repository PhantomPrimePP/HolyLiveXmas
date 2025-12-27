import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-gift-viewer',
  standalone:true,
  imports: [CommonModule,  MatDialogModule, ],
  templateUrl: './gift-viewer.html',
  styleUrl: './gift-viewer.scss',
})
export class GiftViewer  {
  safeYoutubeUrl!: SafeResourceUrl;
constructor(
    public dialogRef: MatDialogRef<GiftViewer>, private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {if (this.isYouTube()) {
      this.safeYoutubeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.toEmbedUrl(this.data.url)
      );
    }}


dialogSize = 1; // 1 = normal size

isImage() {
  return typeof this.data?.type === 'string' &&
         this.data.type.startsWith('image');
}

isAudio() {
  return typeof this.data?.type === 'string' &&
         this.data.type.startsWith('audio');
}

isVideo() {
  return typeof this.data?.type === 'string' &&
         this.data.type.startsWith('video');
}

isMessage() {
  return this.data?.type === 'message' && !!this.data?.message;
}

isYouTube() {
  return this.data?.type === 'youtube';
}

  toEmbedUrl(url: string): string {
    if (!url) return '';

    // youtu.be/XXXX
    if (url.includes('youtu.be')) {
      const id = url.split('/').pop();
      return `https://www.youtube.com/embed/${id}`;
    }

    // youtube.com/watch?v=XXXX
    const match = url.match(/[?&]v=([^&]+)/);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }

    return url; // fallback
  }


}

