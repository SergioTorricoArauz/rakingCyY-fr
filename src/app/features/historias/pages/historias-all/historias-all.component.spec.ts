import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriasAllComponent } from './historias-all.component';

describe('HistoriasAllComponent', () => {
  let component: HistoriasAllComponent;
  let fixture: ComponentFixture<HistoriasAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriasAllComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriasAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
