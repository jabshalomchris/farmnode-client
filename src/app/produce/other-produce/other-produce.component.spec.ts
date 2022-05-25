import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherProduceComponent } from './other-produce.component';

describe('OtherProduceComponent', () => {
  let component: OtherProduceComponent;
  let fixture: ComponentFixture<OtherProduceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherProduceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherProduceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
