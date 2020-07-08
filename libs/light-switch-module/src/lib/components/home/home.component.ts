import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faCaretRight,
  faEllipsisV,
  faPowerOff
} from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription, timer } from 'rxjs';
import { GroupType, HueDiscovery, HueGroup, HueLight } from '../../dal/models';
import { HueGroupService } from '../../dal/services';
import { LightsService } from '../../dal/services/lights.service';

@Component({
  selector: 'ls-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  roomName: string;
  room: HueGroup;
  rooms: HueGroup[];
  powerIcon = faPowerOff;
  menuIcon = faEllipsisV;
  menuItemIcon = faCaretRight;
  token: string;
  ipAddress: string;
  hueDiscovery: HueDiscovery;
  on = true;
  roomLights: HueLight[] = [];
  loading = false;
  timerLength: Observable<number> = timer(15000);
  timer$: Subscription;
  rooms$: Subscription;
  idle = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private groupsService: HueGroupService,
    private lightsService: LightsService
  ) {}

  ngOnInit(): void {
    // debugger;
    this.route.params.subscribe(x => {
      console.log('room change');
      if (x['room'] === 'main') {
        this.roomName = localStorage.getItem('main_room');
        this.groupsService.setRoomByName(this.roomName);
        if (this.timer$ && !this.timer$.closed) {
          this.timer$.unsubscribe();
        }
        return;
      } else {
        this.timer$ = this.timerLength.subscribe(x => {
          this.router.navigate(['home/main']);
        });
      }
      if (this.roomName !== x['room']) {
        this.roomName = x['room'];
        this.groupsService.setRoomByName(this.roomName);
        this.timer$ = this.timerLength.subscribe(x => {
          this.router.navigate(['home/main']);
        });
      }
    });
    this.loading = true;
    this.token = localStorage.getItem('token');
    this.ipAddress = localStorage.getItem('ip_address');
    this.roomName = localStorage.getItem('main_room');
    if (!this.ipAddress || !this.token || !this.roomName) {
      this.router.navigate(['first-time-setup']);
    }
    this.groupsService.refreshStorage();
    this.lightsService.refreshStorage();
    // this.groupsService.setRoomByName(this.roomName);
    this.getAllRooms();
    this.groupsService.getRoom().subscribe(x => {
      this.loading = true;
      // debugger;
      if (!this.room || x.name !== this.room.name) {
        this.room = x;
        this.getRoomLights();
      }
      this.loading = false;
      this.on = x.state.any_on;
    });
  }

  togglePower() {
    if (this.on === true) {
      this.groupsService.powerOff().subscribe(x => {
        this.on = false;
        this.lightsService.refreshLights();
      });
    } else {
      this.groupsService.powerOn().subscribe(x => {
        this.on = true;
        this.lightsService.refreshLights();
      });
    }
  }

  powerOffOtherRoom(index: number) {
    this.groupsService.powerOff(index).subscribe(x => {
      this.lightsService.refreshLights();
    });
  }

  powerOnOtherRoom(index: number) {
    this.groupsService.powerOn(index).subscribe(x => {
      this.lightsService.refreshLights();
    });
  }

  getRoomLights() {
    this.roomLights = [];
    let light: HueLight;
    this.lightsService.getAllLights().subscribe(lights => {
      this.room.lights.map(index => {
        light = lights[index] as HueLight;
        light.index = parseInt(index, 10);
        this.roomLights.push(lights[index]);
      });
    });
  }

  appClickHandler() {
    this.idle = false;
    if (this.timer$) {
      this.timer$.unsubscribe();
    }

    if (this.roomName !== localStorage.getItem('main_room')) {
      this.timer$ = this.timerLength.subscribe(x => {
        this.router.navigate(['home/main']);
        this.idle = true;
      });
    } else {
      this.timer$ = this.timerLength.subscribe(x => {
        this.idle = true;
      });
    }
  }

  dblClickHandler() {
    console.log('dblclick handler');
  }

  getAllRooms() {
    this.rooms$ = this.groupsService.getAllRooms().subscribe(rooms => {
      this.rooms = [];
      let i = 1;
      let flag = true;
      while (flag === true) {
        if (rooms[i.toString()]) {
          let info: HueGroup = rooms[i.toString()] as HueGroup;
          if (info.type === GroupType.Room) {
            this.rooms.push(info);
          }
        } else {
          flag = false;
          break;
        }
        i++;
      }
    });
  }

  ngOnDestroy() {
    if (!this.timer$.closed) {
      this.timer$.unsubscribe();
    }
    if (!this.rooms$.closed) {
      this.rooms$.unsubscribe();
    }
  }
}
