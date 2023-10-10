import {TranslateModule} from '@ngx-translate/core'
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCollectionElementComponent } from './create-collection-element.component';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { HttpClientModule } from '@angular/common/http';

describe('CreateCollectionElementComponent', () => {
  let component: CreateCollectionElementComponent;
  let fixture: ComponentFixture<CreateCollectionElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCollectionElementComponent ],
      imports: [HttpClientModule, TranslateModule.forRoot()],
      providers: [DynamicDialogRef, DynamicDialogConfig, DialogService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCollectionElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
