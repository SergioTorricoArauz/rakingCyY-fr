import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RakingTemporadaComponent } from './raking-temporada.component';

describe('RakingTemporadaComponent', () => {
  let component: RakingTemporadaComponent;
  let fixture: ComponentFixture<RakingTemporadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RakingTemporadaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RakingTemporadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
