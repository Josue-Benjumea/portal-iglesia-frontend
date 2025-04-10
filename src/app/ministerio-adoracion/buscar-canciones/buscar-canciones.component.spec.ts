import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarCancionesComponent } from './buscar-canciones.component';

describe('BuscarCancionesComponent', () => {
  let component: BuscarCancionesComponent;
  let fixture: ComponentFixture<BuscarCancionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscarCancionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscarCancionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
