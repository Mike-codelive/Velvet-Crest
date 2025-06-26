import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  activeIndex: number = 0;

  onMouseEnter(index: number) {
    this.activeIndex = index;
  }

  onMouseLeave() {
    this.activeIndex = 0;
  }
}
