// nav.component.ts
import { Component } from '@angular/core';
import { NavService } from '../../services/nav.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent {
  constructor(public navService: NavService) {}
}
