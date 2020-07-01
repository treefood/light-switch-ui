import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: 'home/:room',
    component: HomeComponent,
    pathMatch: 'full',
    data: { animation: 'homePage' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
