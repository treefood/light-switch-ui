import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'ls-always-display',
  templateUrl: './always-display.component.html',
  styleUrls: ['./always-display.component.scss']
})
export class AlwaysDisplayComponent implements OnInit, OnDestroy {
  clockRefresher$: Subscription;
  timer$ = timer(0, 1000);
  hour: number;
  minute: string;
  period: string;
  constructor() {}

  ngOnInit(): void {
    this.clockRefresher$ = this.timer$.subscribe(interval => {
      const date = new Date();
      this.hour = date.getHours() % 12 || 12;
      this.minute =
        date.getMinutes() < 10
          ? '0' + date.getMinutes().toString()
          : date.getMinutes().toString();
      this.period = date.getHours() < 12 ? 'AM' : 'PM';
    });
  }

  ngOnDestroy(): void {
    if (!this.clockRefresher$.closed) {
      this.clockRefresher$.unsubscribe();
    }
  }
}
