import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetmapComponent } from './fleetmap.component';

describe('FleetmapComponent', () => {
  let component: FleetmapComponent;
  let fixture: ComponentFixture<FleetmapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FleetmapComponent]
    });
    fixture = TestBed.createComponent(FleetmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
