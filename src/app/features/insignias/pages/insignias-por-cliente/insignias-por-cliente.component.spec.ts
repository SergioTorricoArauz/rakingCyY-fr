import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsigniasPorClienteComponent } from './insignias-por-cliente.component';

describe('InsigniasPorClienteComponent', () => {
  let component: InsigniasPorClienteComponent;
  let fixture: ComponentFixture<InsigniasPorClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsigniasPorClienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsigniasPorClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
