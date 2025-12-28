import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NbButtonModule } from '@nebular/theme';

@Component({
  selector: 'dp-content-form',
  imports: [
    CommonModule,    
    NbButtonModule
  ],
  templateUrl: './content-form.component.html',
  styleUrl: './content-form.component.scss'
})
export class ContentFormComponent implements OnInit {
  @Output() onSave = new EventEmitter<any>()
  @Output() onCancel = new EventEmitter<any>()
  showAlert = false;
  messageHeader: string = '';
  loading = false;

  constructor() { }

  ngOnInit(): void {
  } 

  saveHandler() {
    this.onSave.emit();
  }

  cancelHandler() {
    this.onCancel.emit();
  }

  showAlertMessage(error: any) {
    let message = 'Ha ocurrido un error inesperado.';
    if (typeof error === 'string') message = error
    else if (error && error.error && error.error.message) message = error.error.message;
    this.messageHeader = message;
    this.showAlert = true;
  }
}
