import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-gift-viewer',
  standalone:true,
  imports: [CommonModule,  MatDialogModule],
  templateUrl: './gift-viewer.html',
  styleUrl: './gift-viewer.scss',
})
export class GiftViewer {
constructor(
    public dialogRef: MatDialogRef<GiftViewer>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

 isImage() {
  return this.data.type.startsWith('image');
}

isAudio() {
  return this.data.type.startsWith('audio');
}

isVideo() {
  return this.data.type.startsWith('video');
}
dialogSize = 1; // 1 = normal size

isMessage() {
  return this.data.type === 'message';
}



}

