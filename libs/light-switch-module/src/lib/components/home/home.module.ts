import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LightModule } from '../common/light/light.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FontAwesomeModule,
    MatRippleModule,
    LightModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatMenuModule,
    BrowserAnimationsModule
  ]
})
export class HomeModule {}
