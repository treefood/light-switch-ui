import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
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
    FormsModule
  ],
  exports: [LightComponent]
})
export class LightModule {}
