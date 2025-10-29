import { CommonModule } from '@angular/common';
import { Component, Input, SkipSelf } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbFormFieldModule, NbIconModule, NbInputModule } from '@nebular/theme';

@Component({
  selector: 'dp-form-field',
  imports: [
    CommonModule,
    NbInputModule,
    NbIconModule,
    NbFormFieldModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (container: ControlContainer) => container,
      deps: [[new SkipSelf(), ControlContainer]],
    }
  ],
})
export class FormFieldComponent {
  @Input() type: string = 'text'
  @Input() label: string = ''
  @Input() icon: string = ''
  @Input() controlName: string = ''
  @Input() startControlName: string = ''
  @Input() endControlName: string = ''
  @Input() list: any[] = []
  @Input() value: string = ''
  @Input() name: string = ''

  constructor(private parent: FormGroupDirective) {

  }

  ngOnInit(): void {
  }

  get parentFormGroup() {
    return this.parent.form
  }

  validateError(controlName: string = this.controlName) {
    var isInvalid: boolean = false;
    if (this.parentFormGroup.get(controlName)?.invalid
      && (this.parentFormGroup.get(controlName)?.dirty
        || this.parentFormGroup.get(controlName)?.touched)) {

      isInvalid = true;
    }

    return isInvalid;
  }

  getError(controlName: string = this.controlName) {
    var message: string = '';

    if (this.parentFormGroup.get(controlName)?.errors?.['required']) {
      message = 'Este campo es requerido';
    }
    if (this.parentFormGroup.get(controlName)?.errors?.['email']) {
      message = 'Este campo no tiene el formato válido para email';
    }
    return message;
  }
  
  // addKeywordFromInput(event: MatChipInputEvent) {
  //   if (event.value) {
  //     if (!this.parentFormGroup.get(this.controlName).value) this.parentFormGroup.get(this.controlName).setValue([])
  //     this.parentFormGroup.get(this.controlName).value.push(event.value)
  //     this.parentFormGroup.get(this.controlName).updateValueAndValidity()
  //     event.chipInput!.clear()
  //   }
  // }

  // removeKeyword(keyword: string) {
  //   let list = this.parentFormGroup.get(this.controlName).value
  //   this.parentFormGroup.get(this.controlName).setValue(list.filter(o => o != keyword))
  // }

}
