import {TranslateModule} from '@ngx-translate/core'
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldControlsComponent } from './field-controls.component';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

describe('FieldControlsComponent', () => {
  let component: FieldControlsComponent;
  let fixture: ComponentFixture<FieldControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldControlsComponent ],
      imports: [TranslateModule.forRoot()],
      providers: [DynamicDialogRef, DynamicDialogConfig]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
