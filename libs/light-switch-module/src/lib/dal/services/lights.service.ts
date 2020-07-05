import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { filter } from 'rxjs/operators';
import { HueLight } from '../models';

@Injectable({
  providedIn: 'root'
})
export class LightsService {
  ipAddress: string = localStorage.getItem('ip_address');
  token: string = localStorage.getItem('token');
  lightsResponse$: BehaviorSubject<any>;
  lightsResponse: any;
  constructor(private http: HttpClient) {
    if (!this.lightsResponse$) {
      this.lightsResponse$ = <BehaviorSubject<any>>(
        new BehaviorSubject<any>(this.lightsResponse)
      );
    }
    timer(0, 15000).subscribe(interval => {
      this.getAllLights().subscribe(x => {
        this.lightsResponse = x;
        this.lightsResponse$.next(this.lightsResponse);
      });
    });
  }

  getAllLights() {
    this.verifyItems();
    return this.http.get<any>(
      `http://${this.ipAddress}/api/${this.token}/lights`
    );
  }

  refreshStorage(): void {
    this.token = localStorage.getItem('token');
    this.ipAddress = localStorage.getItem('ip_address');
  }

  refreshLights() {
    this.getAllLights().subscribe(x => {
      this.lightsResponse = x;
      this.lightsResponse$.next(this.lightsResponse);
    });
  }

  subscribeToLights(): Observable<HueLight> {
    return this.lightsResponse$
      .asObservable()
      .pipe(filter(x => x !== undefined));
  }

  verifyItems() {
    if (!this.ipAddress) {
      this.ipAddress = localStorage.getItem('ip_address');
    }
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
  }

  powerOn(index: number) {
    return this.http.put<any>(
      `http://${this.ipAddress}/api/${this.token}/lights/${index}/state`,
      { on: true }
    );
  }

  adjustBrightness(index: number, brightness: number) {
    return this.http.put<any>(
      `http://${this.ipAddress}/api/${this.token}/lights/${index}/state`,
      { bri: brightness }
    );
  }

  powerOff(index: number) {
    return this.http.put<any>(
      `http://${this.ipAddress}/api/${this.token}/lights/${index}/state`,
      { on: false }
    );
  }
}
