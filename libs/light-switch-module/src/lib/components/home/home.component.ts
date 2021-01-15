import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faCaretRight,
  faEllipsisV,
  faPowerOff
} from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription, timer } from 'rxjs';
import { retry } from 'rxjs/operators';
import { HueDiscovery, HueGroup, HueLight } from '../../dal/models';
import { HueGroupService } from '../../dal/services';
import { LightsService } from '../../dal/services/lights.service';

@Component({
  selector: 'ls-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('roomMenuTrigger', { static: false })
  roomMenuTrigger: MatMenuTrigger;
  roomName: string;
  room: HueGroup;
  rooms: HueGroup[];
  roomsLoading = true;
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
  timer$: Subscription = new Subscription();
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
        this.resetIdleTimer();
        return;
      } else {
        if (!this.timer$.closed) {
          this.timer$.unsubscribe();
        }
        this.timer$ = this.timerLength.subscribe(x => {
          this.roomMenuTrigger.closeMenu();
          this.router.navigate(['home/main']);
          this.idle = true;
        });
      }
      if (this.roomName !== x['room']) {
        if (!this.timer$.closed) {
          this.timer$.unsubscribe();
        }
        this.roomName = x['room'];
        this.groupsService.setRoomByName(this.roomName);
        this.timer$ = this.timerLength.subscribe(x => {
          this.roomMenuTrigger.closeMenu();
          this.router.navigate(['home/main']);
          this.idle = true;
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
    if (
      this.ipAddress === 'undefined' ||
      this.token === 'undefined' ||
      this.roomName === 'undefined'
    ) {
      this.router.navigate(['first-time-setup']);
    }
    if (
      this.ipAddress === 'null' ||
      this.token === 'null' ||
      this.roomName === 'null'
    ) {
      this.router.navigate(['first-time-setup']);
    }
    this.groupsService.refreshStorage();
    this.lightsService.refreshStorage();
    // this.groupsService.setRoomByName(this.roomName);
    this.getAllRooms();
    this.groupsService
      .getRoom()
      .pipe(retry(5))
      .subscribe(x => {
        this.loading = true;
        // debugger;
        if (!this.room || x.name !== this.room.name) {
          this.room = x;
          console.log('room is now', this.room);
          this.getRoomLights();
        }
        this.loading = false;
        this.on = x.state.any_on;
      });
  }

  togglePower() {
    if (this.roomLights.length < 7) {
      this.togglePowerEfficient();
      return;
    }
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

  togglePowerEfficient() {
    console.log('efficient route');
    if (this.on === true) {
      this.roomLights.map(x => {
        this.lightsService.powerOff(x.index).subscribe(res => {
          console.log('powering off', x.name);
        });
      });
      this.on = false;
      this.lightsService.refreshLights();
    } else {
      this.roomLights.map(x => {
        this.lightsService.powerOn(x.index).subscribe(res => {
          console.log('powering on', x.name);
        });
      });
      this.on = true;
      this.lightsService.refreshLights();
    }
  }

  powerOffOtherRoom(index: number) {
    this.resetIdleTimer();
    this.groupsService.powerOff(index).subscribe(x => {
      this.lightsService.refreshLights();
      if (index.toString() === this.room.id) {
        this.on = false;
      }
    });
  }

  powerOnOtherRoom(index: number) {
    this.resetIdleTimer();
    this.groupsService.powerOn(index).subscribe(x => {
      this.lightsService.refreshLights();
      if (index.toString() === this.room.id) {
        this.on = true;
      }
    });
  }

  getRoomLights() {
    this.roomLights = [];
    let light: HueLight;
    this.lightsService
      .getAllLights()
      .pipe(retry(5))
      .subscribe(lights => {
        this.room.lights.map(index => {
          light = lights[index] as HueLight;
          light.index = parseInt(index, 10);
          this.roomLights.push(lights[index]);
        });
      });
  }

  appClickHandler() {
    this.idle = false;

    if (this.roomName !== localStorage.getItem('main_room')) {
      if (!this.timer$.closed) {
        this.timer$.unsubscribe();
      }

      this.timer$ = this.timerLength.subscribe(x => {
        this.roomMenuTrigger.closeMenu();
        this.router.navigate(['home/main']);
        this.idle = true;
      });
    } else {
      this.resetIdleTimer();
    }
  }

  dblClickHandler() {
    console.log('dblclick handler');
  }

  getAllRooms() {
    // console.log('getting all rooms');
    this.rooms$ = this.groupsService
      .getAllRooms()
      .pipe(retry(5))
      .subscribe(
        rooms => {
          this.rooms = rooms;
          // Object.keys(rooms).map(roomId => {
          //   if ((rooms[roomId] as HueGroup).type === GroupType.Room) {
          //     this.rooms.push(rooms[roomId] as HueGroup);
          //   }
          // });
          this.roomsLoading = false;
        },
        err => {
          console.log('error occured while trying to obtain rooms:', err);
        }
      );
  }

  resetIdleTimer() {
    if (!this.timer$.closed) {
      this.timer$.unsubscribe();
    }

    this.timer$ = this.timerLength.subscribe(x => {
      this.roomMenuTrigger.closeMenu();
      this.idle = true;
    });
  }

  ngOnDestroy() {
    if (this.timer$ && !this.timer$.closed) {
      this.timer$.unsubscribe();
    }
    if (this.timer$ && !this.rooms$.closed) {
      this.rooms$.unsubscribe();
    }
  }
}
