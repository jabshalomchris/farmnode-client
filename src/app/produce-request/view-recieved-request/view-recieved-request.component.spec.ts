import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRecievedRequestComponent } from './view-recieved-request.component';

describe('ViewRecievedRequestComponent', () => {
  let component: ViewRecievedRequestComponent;
  let fixture: ComponentFixture<ViewRecievedRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewRecievedRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRecievedRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
