import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NbActionsModule, NbAlertModule, NbCardModule, NbSpinnerModule } from '@nebular/theme';
import Swal from 'sweetalert2';

@Component({
  selector: 'dp-content',
  imports: [
    CommonModule,
    NbAlertModule,
    NbCardModule,
    NbActionsModule,
    NbSpinnerModule
  ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss'
})
export class ContentComponent {
  @Input() title: string = ''
  showAlert = false;
  messageHeader: string = '';
  loading = false;

  constructor() { }

  onClose() {
    this.showAlert = false;
  }

  showAlertMessage(error: any) {
    let message = 'Ha ocurrido un error inesperado.';
    if (typeof error === 'string') message = error
    else if (error && error.error && error.error.message) message = error.error.message;
    this.messageHeader = message;
    this.showAlert = true;
  }

  async showConfirmMessage(message: string, title: string = 'Confirmación') {
    const result = await Swal.fire({
      title,
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    });
    return result.isConfirmed;
  }
}
