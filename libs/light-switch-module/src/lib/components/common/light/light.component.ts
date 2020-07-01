import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatSlider } from '@angular/material/slider';
import { Subscription, timer } from 'rxjs';
import { HueLight } from '../../../dal/models';
import { HueGroupService } from '../../../dal/services';
import { LightsService } from '../../../dal/services/lights.service';

@Component({
  selector: 'ls-light',
  templateUrl: './light.component.html',
  styleUrls: ['./light.component.scss']
})
export class LightComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() name: string;
  @Input() on: boolean;
  @Input() index: number;
  @Input() brightness: number;
  @ViewChild(MatSlider) slider: MatSlider;
  subscription$: Subscription;
  timer$ = timer(0, 1000);
  timerSubscription$: Subscription;
  releaseMutex = true;

  constructor(
    private lightsService: LightsService,
    private groupService: HueGroupService
  ) {
    this.subscription$ = this.lightsService
      .subscribeToLight(this.index)
      .subscribe(x => {
        // console.log('light:', x);
        let light: HueLight;
        if (!this.index) {
          return;
        }
        light = x[this.index] as HueLight;
        this.on = light.state.on;
        this.name = light.name;
        this.brightness = light.state.bri;
      });
  }

  ngOnInit(): void {
    // console.log(this.name, 'has been added');
  }

  ngAfterViewInit(): void {
    this.blurSlider();
  }

  blurSlider(): void {
    console.log('blurring slider');
    this.slider.blur();
  }

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
    if (this.timerSubscription$) {
      this.timerSubscription$.unsubscribe();
    }
  }

  togglePower() {
    if (this.on) {
      this.lightsService.powerOff(this.index).subscribe(x => {
        this.on = false;
        this.groupService.refreshRoom();
      });
    } else {
      this.lightsService.powerOn(this.index).subscribe(x => {
        this.on = true;
        this.groupService.refreshRoom();
      });
    }
  }
  touchHandler(value) {
    this.brightness = value;
    if (!this.timerSubscription$ || this.timerSubscription$.closed) {
      this.timerSubscription$ = this.timer$.subscribe(interval => {
        console.log('touch interval');
        this.lightsService
          .adjustBrightness(this.index, this.brightness)
          .subscribe(x => {
            if (this.releaseMutex) {
              this.timerSubscription$.unsubscribe();
            }
          });
      });
    }
  }
}
