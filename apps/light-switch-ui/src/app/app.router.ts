import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LightSwitchModule } from '@treefood-nx-angular/light-switch-module';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home/main',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      enableTracing: false
    }),
    LightSwitchModule
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
