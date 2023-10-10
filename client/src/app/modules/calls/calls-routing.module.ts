import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CallsComponent } from './calls.component';

const routes: Routes = [{ path: '', component: CallsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CallsRoutingModule { }
