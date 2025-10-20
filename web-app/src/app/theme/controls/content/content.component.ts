import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NbActionsModule, NbCardModule } from '@nebular/theme';

@Component({
  selector: 'dp-content',
  imports: [
    CommonModule,
    NbCardModule,
    NbActionsModule,
  ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss'
})
export class ContentComponent {
  @Input() title: string = ''

  constructor() { }
}
