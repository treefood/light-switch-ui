import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { filter } from 'rxjs/operators';
import { HueGroup } from '../models';

@Injectable({
  providedIn: 'root'
})
export class HueGroupService {
  room$: BehaviorSubject<HueGroup>;
  room: HueGroup;
  roomIndex: number;
  token: string;
  ipAddress: string;
  timer$: Observable<number>;

  constructor(private http: HttpClient) {
    this.refreshStorage();
    if (!this.room$) {
      this.room$ = <BehaviorSubject<HueGroup>>new BehaviorSubject(this.room);
    }
    this.timer$ = timer(0, 30000);
    this.timer$.subscribe(interval => {
      this.refreshRoom();
    });
  }

  powerOn() {
    return this.http.put<any>(
      `http://${this.ipAddress}/api/${this.token}/groups/${this.roomIndex}/action`,
      {
        on: true
      }
    );
  }

  powerOff() {
    return this.http.put<any>(
      `http://${this.ipAddress}/api/${this.token}/groups/${this.roomIndex}/action`,
      {
        on: false
      }
    );
  }

  getRoom(): Observable<HueGroup> {
    return this.room$.asObservable().pipe(filter(x => x !== undefined));
  }

  getAllRooms(): Observable<HueGroup> {
    return this.http.get<HueGroup>(
      `http://${this.ipAddress}/api/${this.token}/groups`
    );
  }

  refreshStorage(): void {
    this.token = localStorage.getItem('token');
    this.ipAddress = localStorage.getItem('ip_address');
  }

  refreshRoom() {
    if (!this.roomIndex) {
      return;
    }
    this.http
      .get<HueGroup>(
        `http://${this.ipAddress}/api/${this.token}/groups/${this.roomIndex}`
      )
      .subscribe(x => {
        if (JSON.stringify(this.room) !== JSON.stringify(x)) {
          this.room = x;
        }
        this.room$.next(this.room);
      });
  }

  setRoomByName(name: string) {
    this.http
      .get<HueGroup>(`http://${this.ipAddress}/api/${this.token}/groups`)
      .subscribe(x => {
        let i = 1;
        let flag = true;
        while (flag === true) {
          if (x[i.toString()]) {
            if (x[i.toString()]['name'] === name) {
              this.room = x[i.toString()];
              this.room$.next(this.room);
              this.roomIndex = i;
              return;
            }
          } else {
            flag = false;
            break;
          }
          i++;
        }
      });
  }
}
