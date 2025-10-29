import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from '../../../../theme/controls/form-field/form-field.component';
import { NbButtonModule } from '@nebular/theme';
import { ContentFormComponent } from '../../../../theme/controls/content-form/content-form.component';

@Component({
  selector: 'app-user-set',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormFieldComponent,
    NbButtonModule,
    ContentFormComponent
  ],
  templateUrl: './user-set.component.html',
  styleUrl: './user-set.component.scss'
})
export class UserSetComponent {
  userFormGroup: FormGroup;

  constructor() {
    this.userFormGroup = new FormGroup({
      email: new FormControl('', Validators.required),
      displayName: new FormControl('', Validators.required),
    });
  }

  cancel() {
    // Lógica para cancelar la operación
  }

  save() {
    if (this.userFormGroup.valid) {
      const userData = this.userFormGroup.value;
      // Lógica para guardar los datos del usuario
    } else {
      // Manejar el caso de formulario inválido
    } 
  }
}
