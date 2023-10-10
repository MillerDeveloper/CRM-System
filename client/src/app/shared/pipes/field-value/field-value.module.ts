import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldValuePipe } from './field-value.pipe';



@NgModule({
  declarations: [FieldValuePipe],
  imports: [
    CommonModule,
  ],
  exports: [FieldValuePipe]
})
export class FieldValueModule { }
