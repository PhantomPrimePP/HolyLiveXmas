import { Component, signal } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { GiftUpload } from './gift-upload/gift-upload';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    GiftUpload,
    RouterLink,RouterModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  constructor(private dialog: MatDialog) {}

  openGiftUpload() {
    this.dialog.open(GiftUpload, {
      width: '500px'
    });
  }
}
