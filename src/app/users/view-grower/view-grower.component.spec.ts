import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGrowerComponent } from './view-grower.component';

describe('ViewGrowerComponent', () => {
  let component: ViewGrowerComponent;
  let fixture: ComponentFixture<ViewGrowerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewGrowerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGrowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
