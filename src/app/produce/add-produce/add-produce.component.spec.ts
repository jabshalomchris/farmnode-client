import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProduceComponent } from './add-produce.component';

describe('AddProduceComponent', () => {
  let component: AddProduceComponent;
  let fixture: ComponentFixture<AddProduceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProduceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProduceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
