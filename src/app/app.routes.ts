import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Room } from './room/room';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'room', component: Room }
];
