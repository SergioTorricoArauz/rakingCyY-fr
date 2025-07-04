import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearTemporadaComponent } from './crear-temporada.component';

describe('CrearTemporadaComponent', () => {
  let component: CrearTemporadaComponent;
  let fixture: ComponentFixture<CrearTemporadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearTemporadaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearTemporadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
