import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ElementCardComponent } from './element-card.component';

const routes: Routes = [{ path: '', component: ElementCardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ElementCardRoutingModule { }
