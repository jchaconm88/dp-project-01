import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NB_WINDOW_CONTEXT, NbButtonModule, NbWindowRef } from '@nebular/theme';
import { UserService } from '@system/services/user.service';
import { ContentFormComponent } from '@theme/controls/content-form/content-form.component';
import { FormFieldComponent } from '@theme/controls/form-field/form-field.component';

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
export class UserSetComponent implements OnInit {
  @ViewChild(ContentFormComponent, { static: true }) content: ContentFormComponent = new ContentFormComponent;
  userFormGroup: FormGroup;
  userId!: string;
  user: any;

  constructor(private userService: UserService, private windowRef: NbWindowRef, @Inject(NB_WINDOW_CONTEXT) context: any) {
    console.log(context)
    this.userId = context.userId;
    this.userFormGroup = new FormGroup({
      email: new FormControl('', Validators.required),
      displayName: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.load()
  }

  load() {
    try {
      if (this.userId) {
        console.log("Entro")
        this.content.loading = true
        this.userService.userGet(this.userId)
          .subscribe({
            next: (data) => {
              console.log(data)
              this.user = data;
              this.userFormGroup.patchValue(this.user);
            },
            error: (err) => {
              console.error('Error en load:', err.error);
              this.content.showAlertMessage(err.error.message)
              this.content.loading = false
            }
          })
      }
    } catch (err: any) {
      console.error('Error en load:', err.error);
      this.content.showAlertMessage(err.error.message)
      this.content.loading = false
    }
  }

  cancel() {
    this.windowRef.close();
  }

  save() {
    try {
      if (this.userFormGroup.valid) {
        this.content.loading = true
        const formData = this.userFormGroup.value;
        if (this.userId) {
          this.userService.userEdit(this.userId, formData)
            .subscribe({
              next: (data) => {
                this.windowRef.close(data);
              },
              error: (err) => {
                console.error('Error en edit:', err.error);
                this.content.showAlertMessage(err.error.message)
                this.content.loading = false
              }
            });
        }
        else {
          this.userService.userAdd(formData)
            .subscribe({
              next: (data) => {
                this.windowRef.close(data);
              },
              error: (err) => {
                console.error('Error en add:', err.error);
                this.content.showAlertMessage(err.error.message)
                this.content.loading = false
              }
            });
        }
      }
    } catch (err: any) {
      console.error('Error en save:', err.error);
      this.content.showAlertMessage(err.error.message)
      this.content.loading = false

    }
  }
}
