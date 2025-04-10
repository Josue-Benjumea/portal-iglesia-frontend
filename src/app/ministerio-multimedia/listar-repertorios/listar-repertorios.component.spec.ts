import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarRepertoriosComponent } from './listar-repertorios.component';

describe('ListarRepertoriosComponent', () => {
  let component: ListarRepertoriosComponent;
  let fixture: ComponentFixture<ListarRepertoriosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarRepertoriosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarRepertoriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
