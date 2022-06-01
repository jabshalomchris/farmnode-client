import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSentRequestComponent } from './view-sent-request.component';

describe('ViewSentRequestComponent', () => {
  let component: ViewSentRequestComponent;
  let fixture: ComponentFixture<ViewSentRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSentRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
