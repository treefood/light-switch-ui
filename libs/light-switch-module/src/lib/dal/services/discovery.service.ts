import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HueDiscovery, HueGroup } from '../models';

@Injectable({
  providedIn: 'root'
})
export class HueDiscoveryService {
  constructor(private http: HttpClient) {}

  getBridges() {
    return this.http.get<HueDiscovery[]>('https://discovery.meethue.com/');
  }

  checkBridgeAuthentication(ipAddress: string) {
    return this.http.post<any>(`http://${ipAddress}/api`, {
      devicetype: 'light_switch#raspberry_pi'
    });
  }

  getGroups(ipAddress: string, token: string) {
    return this.http.get<HueGroup>(`http://${ipAddress}/api/${token}/groups`);
  }

  getConfigs(ipAddress: string, token: string) {
    return this.http.get<HueGroup>(`http://${ipAddress}/api/${token}/config`);
  }
}
