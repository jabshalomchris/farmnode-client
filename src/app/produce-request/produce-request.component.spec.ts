import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduceRequestComponent } from './produce-request.component';

describe('ProduceRequestComponent', () => {
  let component: ProduceRequestComponent;
  let fixture: ComponentFixture<ProduceRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProduceRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProduceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
