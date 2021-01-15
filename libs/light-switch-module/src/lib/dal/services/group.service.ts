import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { filter } from 'rxjs/operators';
import { GroupType, HueGroup } from '../models';
import { LightsService } from './lights.service';

@Injectable({
  providedIn: 'root'
})
export class HueGroupService {
  room$: BehaviorSubject<HueGroup>;
  allRooms$: BehaviorSubject<any>;
  allRooms: HueGroup[] = [];
  room: HueGroup;
  roomIndex: number;
  roomName: string;
  token: string;
  ipAddress: string;
  timer$: Observable<number>;

  constructor(private http: HttpClient, private lightService: LightsService) {
    this.roomIndex = 1;
    this.refreshStorage();
    if (!this.room$) {
      this.room$ = <BehaviorSubject<HueGroup>>new BehaviorSubject(this.room);
    }
    if (!this.allRooms$) {
      this.allRooms$ = <BehaviorSubject<any>>new BehaviorSubject(this.allRooms);
    }
    this.timer$ = timer(5000, 30000);
    this.timer$.subscribe(interval => {
      this.refreshRoom();
    });
  }

  powerOn(index?: number) {
    console.log(`http://${this.ipAddress}/api/${this.token}/groups/${index}`);
    this.refreshStorage();
    if (index) {
      return this.http.put<any>(
        `http://${this.ipAddress}/api/${this.token}/groups/${index}/action`,
        {
          on: true
        }
      );
    } else {
      return this.http.put<any>(
        `http://${this.ipAddress}/api/${this.token}/groups/${this.roomIndex}/action`,
        {
          on: true
        }
      );
    }
  }

  powerOff(index?: number) {
    this.refreshStorage();
    if (index) {
      return this.http.put<any>(
        `http://${this.ipAddress}/api/${this.token}/groups/${index}/action`,
        {
          on: false
        }
      );
    } else {
      return this.http.put<any>(
        `http://${this.ipAddress}/api/${this.token}/groups/${this.roomIndex}/action`,
        {
          on: false
        }
      );
    }
  }

  getRoom(): Observable<HueGroup> {
    this.refreshStorage();
    return this.room$.asObservable().pipe(filter(x => x !== undefined));
  }

  getAllRooms(): Observable<HueGroup[]> {
    this.refreshStorage();
    return this.allRooms$.asObservable().pipe(filter(x => x !== undefined));
  }

  refreshStorage(): void {
    this.token = localStorage.getItem('token');
    this.ipAddress = localStorage.getItem('ip_address');
  }

  refreshRoom() {
    this.refreshStorage();
    console.log(`http://${this.ipAddress}/api/${this.token}/groups`);
    this.http
      .get<HueGroup>(`http://${this.ipAddress}/api/${this.token}/groups`)
      .subscribe(x => {
        if (JSON.stringify(this.room) !== JSON.stringify(x[this.roomIndex])) {
          this.room = x[this.roomIndex];
        }
        let rooms: HueGroup[] = [];
        Object.keys(x).map(roomId => {
          let room: HueGroup = x[roomId];
          if ((room as HueGroup).name === this.roomName) {
            this.room = room;
          }
          if ((room as HueGroup).type === GroupType.Room) {
            room.id = roomId;
            rooms.push(room);
          }
        });
        this.allRooms = rooms;
        this.allRooms$.next(this.allRooms);
        this.room$.next(this.room);
      });
  }

  setRoomByName(name: string) {
    this.roomName = name;
    this.refreshRoom();
  }
}
