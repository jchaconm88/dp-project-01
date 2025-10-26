import { CommonModule, Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NbActionsModule, NbButtonModule, NbCardModule, NbIconModule } from '@nebular/theme';

@Component({
  selector: 'dp-content-detail',
  imports: [
    CommonModule,
    NbCardModule,
    NbActionsModule,
    NbButtonModule,
    NbIconModule
  ],
  templateUrl: './content-detail.component.html',
  styleUrl: './content-detail.component.scss'
})
export class ContentDetailComponent {
  @Input() title: string = ''
  
  constructor(private location: Location) {    
  }

  goBack(): void {
    this.location.back();
  }
}
