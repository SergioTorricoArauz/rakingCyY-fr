import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearHistoriasComponent } from './crear-historias.component';

describe('CrearHistoriasComponent', () => {
  let component: CrearHistoriasComponent;
  let fixture: ComponentFixture<CrearHistoriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearHistoriasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearHistoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
