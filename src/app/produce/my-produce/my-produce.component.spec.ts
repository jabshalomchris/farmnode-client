import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProduceComponent } from './my-produce.component';

describe('MyProduceComponent', () => {
  let component: MyProduceComponent;
  let fixture: ComponentFixture<MyProduceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyProduceComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProduceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
