import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlwaysDisplayComponent } from './always-display.component';

describe('AlwaysDisplayComponent', () => {
  let component: AlwaysDisplayComponent;
  let fixture: ComponentFixture<AlwaysDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlwaysDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlwaysDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
