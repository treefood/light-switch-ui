import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { faHandPointRight } from '@fortawesome/free-solid-svg-icons';
import { Subscription, timer } from 'rxjs';
import { GroupType, HueDiscovery, HueError, HueGroup } from '../../dal/models';
import { HueDiscoveryService } from '../../dal/services';

@Component({
  selector: 'ls-first-time-setup',
  templateUrl: './first-time-setup.component.html',
  styleUrls: ['./first-time-setup.component.scss']
})
export class FirstTimeSetupComponent implements OnInit, OnDestroy {
  discoveredBridges: HueDiscovery[];
  selectedBridge: HueDiscovery;
  handIcon = faHandPointRight;
  token: string;
  loading = false;
  authenticated = false;
  errorMessage: HueError;
  groups: string[];
  selectedGroup: string;
  bridgeName: string;
  storageObserver: Subscription;

  constructor(
    private discoverer: HueDiscoveryService,
    private iconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private router: Router
  ) {
    this.iconRegistry.addSvgIcon(
      'hue_bridge',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'assets/HueIconPack2019/devicesBridgesV2.svg'
      )
    );
  }

  ngOnInit(): void {
    this.discoverer.getBridges().subscribe(bridges => {
      this.discoveredBridges = bridges;
      this.selectedBridge = bridges[0];
      this.getBridgeName();
    });
    this.storageObserver = timer(0, 2000).subscribe(x => {
      console.log('checking storage');
      this.checkStorage();
    });
  }

  checkStorage(): void {
    let redirectNeeded = true;
    const checkValues = ['main_room', 'token', 'ip_address'];
    checkValues.map(key => {
      if (!localStorage.getItem(key) || localStorage.getItem(key) === 'null') {
        redirectNeeded = false;
        console.log('did not find a value for', key);
      }
    });
    if (redirectNeeded) {
      this.router.navigate(['home/main']);
    }
  }

  verifyAuthentication() {
    this.errorMessage = null;
    this.loading = true;
    this.discoverer
      .checkBridgeAuthentication(this.selectedBridge.internalipaddress)
      .subscribe(res => {
        this.loading = false;
        let response = res[0];
        if (response['success']) {
          this.authenticated = true;
          this.errorMessage = null;
          this.token = response['success']['username'];
          this.getBridgeName();
        }
        if (response['error']) {
          this.errorMessage = response['error'];
        }
      });
  }

  getGroups() {
    this.groups = [];
    this.loading = true;
    this.discoverer
      .getGroups(this.selectedBridge.internalipaddress, this.token)
      .subscribe(x => {
        let i = 1;
        let flag = true;
        while (flag === true) {
          if (x[i.toString()]) {
            let info: HueGroup = x[i.toString()];
            if (info.type === GroupType.Room) {
              this.groups.push(info.name);
            }
          } else {
            flag = false;
            break;
          }
          i++;
        }
      });
  }
  getBridgeName() {
    this.discoverer
      .getConfigs(this.selectedBridge.internalipaddress, 'notNeeded')
      .subscribe(x => {
        this.bridgeName = x['name'];
      });
  }

  save() {
    localStorage.setItem('token', this.token);
    localStorage.setItem('ip_address', this.selectedBridge.internalipaddress);
    localStorage.setItem('main_room', this.selectedGroup);
    this.router.navigate(['home/main']);
  }

  ngOnDestroy() {
    if (this.storageObserver && !this.storageObserver.closed) {
      this.storageObserver.unsubscribe();
    }
  }
}
