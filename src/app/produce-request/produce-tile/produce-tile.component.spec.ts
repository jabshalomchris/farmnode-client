import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduceTileComponent } from './produce-tile.component';

describe('ProduceTileComponent', () => {
  let component: ProduceTileComponent;
  let fixture: ComponentFixture<ProduceTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProduceTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProduceTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
