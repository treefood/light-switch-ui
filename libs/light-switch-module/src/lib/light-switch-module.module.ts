import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { FirstTimeSetupModule } from './components/first-time-setup/first-time-setup.module';
import { HomeModule } from './components/home/home.module';

export const lightSwitchModuleRoutes: Route[] = [];

@NgModule({
  imports: [CommonModule, RouterModule, HomeModule, FirstTimeSetupModule]
})
export class LightSwitchModule {}
