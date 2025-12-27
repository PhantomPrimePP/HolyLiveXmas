import { NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-end-page',
  imports: [NgIf],
  templateUrl: './end-page.html',
  styleUrl: './end-page.scss',
})
export class EndPage {
isMisaCardOpen = false;

toggleMisaCard() {
  this.isMisaCardOpen = !this.isMisaCardOpen;
}
}
