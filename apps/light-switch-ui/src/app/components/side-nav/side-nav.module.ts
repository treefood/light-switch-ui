import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { SideNavComponent } from './side-nav.component';

@NgModule({
  declarations: [SideNavComponent],
  imports: [CommonModule, MatIconModule, MatRippleModule, RouterModule],
  exports: [SideNavComponent]
})
export class SideNavModule {}
