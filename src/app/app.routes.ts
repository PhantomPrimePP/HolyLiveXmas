import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Room } from './room/room';
import { Birthday } from './birthday/birthday';
import { SpecialKyle } from './special-kyle/special-kyle';
import { EndPage } from './end-page/end-page';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'room', component: Room },
  { path: 'birthday', component: Birthday},
  { path: 'kyle1', component:SpecialKyle},
  {path: 'end', component:EndPage}

];
