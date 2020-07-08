import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AlwaysDisplayComponent } from './always-display.component';

@NgModule({
  declarations: [AlwaysDisplayComponent],
  imports: [CommonModule],
  exports: [AlwaysDisplayComponent]
})
export class AlwaysDisplayModule {}
