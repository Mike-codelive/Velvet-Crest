import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  @Input() style: 'primary' | 'secondary' | 'outline' = 'primary';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() wFull: boolean = false;
  @Input() paddingX: string = 'px-10';
  @Input() paddingY: string = 'py-3.5';
  @Output() click = new EventEmitter<Event>();

  handleClick(event: Event) {
    this.click.emit(event);
  }
}
