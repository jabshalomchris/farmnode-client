import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindProducesComponent } from './find-produces.component';

describe('FindProducesComponent', () => {
  let component: FindProducesComponent;
  let fixture: ComponentFixture<FindProducesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindProducesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindProducesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
