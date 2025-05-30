import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-cta',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './cta.component.html',
  styleUrl: './cta.component.css',
})
export class CtaComponent {
  @Input() headline: string = 'BACK IN STOCK: Discover our rarest opal';
  @Input() headlineTag: boolean = false;
  @Input() subheadline: string =
    'Herzegovinian Opal - A singular gemstone marvel';
  @Input() description: string =
    'If you missed out last year, now’s your chance to experience something truly unique - these rare Herzegovinian opals, small as a pearl, shimmer with hues of azure, violet, and gold. A must-have for those seeking timeless luxury and distinction.';
  @Input() buttonText: string = 'Shop Now';
  @Input() buttonStyle: 'primary' | 'secondary' | 'outline' = 'secondary';
  @Input() bgColor: string = 'bg-seashell';
  @Input() innerBg: string = 'bg-seashell';
  @Input() reverseLayout: boolean = false;
  @Input() paddingY: boolean = false;
  @Input() textPaddingLefth: boolean = true;
  @Input() showSeparator: boolean = false;
  @Input() showBanner: boolean = false;
  @Input() images: { src: string; alt: string }[] = [
    { src: '/cta.jpg', alt: 'CTA image' },
  ];
}
