import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeliveriesComponent } from './deliveries.component';

const routes: Routes = [{ path: '', component: DeliveriesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeliveriesRoutingModule { }
