import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {  MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOption, MatSelectModule } from '@angular/material/select';
import { GiftService } from '../services/gift.service';


@Component({
  selector: 'app-gift-upload',
  imports: [MatFormFieldModule,
   MatInputModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    MatDialogModule,
    MatButtonModule,
    NgFor,
    CommonModule,
   NgIf
  ],
  templateUrl: './gift-upload.html',
  styleUrl: './gift-upload.scss',
})
export class GiftUpload {
submissionsOpen = false; // 🔒 archived mode

giftData = {
  name: '',
  type: 'file',     // default
  file: null as File | null,
  message: '',
   youtubeUrl: '',
  boxImage: ''
};


giftBoxes = [
  { name: 'Box 1', image: 'Box1.png' },
  { name: 'Box 2', image: 'Box2.png' },
  { name: 'Box 3', image: 'Box3.png' },
  { name: 'Box 4', image: 'Box4.png' },
  { name: 'Box 5', image: 'Box5.png' },
  { name: 'Box 6', image: 'Box6.png' },
  { name: 'Box 7', image: 'Box7.png' },
  { name: 'Box 8', image: 'Box8.png' },
];


  constructor(private dialogRef: MatDialogRef<GiftUpload>,private giftService: GiftService) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.giftData.file = file;
  }

async submit() {
  if (!this.giftData.name || !this.giftData.boxImage) {
    alert("Name and Gift Box required!");
    return;
  }

  if (this.giftData.type === "file" && !this.giftData.file) {
    alert("Please upload a file!");
    return;
  }

  if (this.giftData.type === "message" && !this.giftData.message.trim()) {
    alert("Please write a message!");
    return;
  }
  if (this.giftData.type === "youtube" && !this.giftData.youtubeUrl.trim()) {
  alert("Please provide a YouTube link!");
  return;
}

  const result = await this.giftService.uploadGift(
    this.giftData.name,
    this.giftData.boxImage,
    this.giftData.file,
    this.giftData.type,
    this.giftData.message,
     this.giftData.youtubeUrl
  );

  if (result.success) {
    alert("Gift uploaded successfully!");
    this.dialogRef.close();
  } else {
    alert("Upload failed, check console.");
  }
}}
