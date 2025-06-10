import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-footer',
  imports: [ButtonComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  currentYear!: number;

  ngOnInit() {
    this.currentYear = new Date().getFullYear();
  }

  menuSections = [
    {
      title: 'about',
      items: ['about us', 'Our Ethics', 'Store Locator', 'wholesale'],
    },
    {
      title: 'discover',
      items: ['Subscriptions', 'Rewards', 'Brewing Guide', 'blog'],
    },
    {
      title: 'support',
      items: [
        'contact us',
        'shipping',
        'FAQ',
        'Terms & Conditions',
        'My Account',
      ],
    },
  ];

  expandedSections: boolean[] = new Array(this.menuSections.length).fill(false);

  toggleSection(index: number) {
    const isCurrentlyOpen = this.expandedSections[index];

    this.expandedSections.fill(false);
    if (!isCurrentlyOpen) {
      this.expandedSections[index] = true;
    }
  }
}
