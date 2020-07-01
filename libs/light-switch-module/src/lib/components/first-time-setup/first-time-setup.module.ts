import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FirstTimeSetupRoutingModule } from './first-time-setup-routing.module';
import { FirstTimeSetupComponent } from './first-time-setup.component';

@NgModule({
  declarations: [FirstTimeSetupComponent],
  imports: [
    CommonModule,
    FirstTimeSetupRoutingModule,
    MatStepperModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    FontAwesomeModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule
  ]
})
export class FirstTimeSetupModule {}
