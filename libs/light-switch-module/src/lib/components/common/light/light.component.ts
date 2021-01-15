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
  @Input() saturation: number;
  @Input() hue: number;
  @Input() xy: number[];
  @Input() type: string;
  @ViewChild(MatSlider) slider: MatSlider;
  color: string = 'red';
  subscription$: Subscription;
  timer$ = timer(0, 250);
  timerSubscription$: Subscription;
  releaseMutex = true;

  constructor(
    private lightsService: LightsService,
    private groupService: HueGroupService
  ) {}

  ngOnInit(): void {
    this.subscription$ = this.lightsService.subscribeToLights().subscribe(x => {
      // console.log('light:', x);
      let light: HueLight;
      if (!this.index) {
        return;
      }
      light = x[this.index] as HueLight;
      this.on = light.state.on;
      this.name = light.name;
      this.brightness = light.state.bri;
      this.saturation = light.state.sat;
      this.hue = light.state.hue;
      this.xy = light.state.xy;
      this.getHTMLColor();
    });
  }

  ngAfterViewInit(): void {
    this.blurSlider();
  }

  getHTMLColor() {
    if (!this.xy) {
      return;
    }
    console.log('x:', this.xy[0], 'y', this.xy[1]);
    const X = 100 * (this.xy[0] / this.xy[1]);
    const Z = (100 / this.xy[1]) * (1 - X - 100);
    console.log(this.name, 'calc x:', X, 'calc Z:', Z);
    const rgbVal = this.xyBriToRgb(this.xy[0], this.xy[1], this.brightness);
    this.color = `rgb(${rgbVal.r}, ${rgbVal.g}, ${rgbVal.b})`;
  }
  xyBriToRgb(x, y, bri) {
    let z = 1.0 - x - y;
    let Y = bri / 255.0; // Brightness of lamp
    let X = (Y / y) * x;
    let Z = (Y / y) * z;
    let r = X * 1.612 - Y * 0.203 - Z * 0.302;
    let g = -X * 0.509 + Y * 1.412 + Z * 0.066;
    let b = X * 0.026 - Y * 0.072 + Z * 0.962;
    r =
      r <= 0.0031308
        ? 12.92 * r
        : (1.0 + 0.055) * Math.pow(r, 1.0 / 2.4) - 0.055;
    g =
      g <= 0.0031308
        ? 12.92 * g
        : (1.0 + 0.055) * Math.pow(g, 1.0 / 2.4) - 0.055;
    b =
      b <= 0.0031308
        ? 12.92 * b
        : (1.0 + 0.055) * Math.pow(b, 1.0 / 2.4) - 0.055;
    let maxValue = Math.max(r, g, b);
    r /= maxValue;
    g /= maxValue;
    b /= maxValue;
    r = r * 255;
    if (r < 0) {
      r = 255;
    }
    g = g * 255;
    if (g < 0) {
      g = 255;
    }
    b = b * 255;
    if (b < 0) {
      b = 255;
    }
    return {
      r: r,
      g: g,
      b: b
    };
  }

  blurSlider(): void {
    console.log('blurring slider');
    if (this.slider) {
      this.slider.blur();
    }
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
