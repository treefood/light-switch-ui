import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { LightComponent } from './light.component';

@NgModule({
  declarations: [LightComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatSlideToggleModule,
    MatSliderModule,
    FormsModule,
    MatRippleModule
  ],
  exports: [LightComponent]
})
export class LightModule {}
