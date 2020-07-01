import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FirstTimeSetupComponent } from './first-time-setup.component';

const routes: Routes = [
  {
    path: 'first-time-setup',
    component: FirstTimeSetupComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FirstTimeSetupRoutingModule {}
