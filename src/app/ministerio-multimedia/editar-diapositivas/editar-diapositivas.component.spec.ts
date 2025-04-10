import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarDiapositivasComponent } from './editar-diapositivas.component';

describe('EditarDiapositivasComponent', () => {
  let component: EditarDiapositivasComponent;
  let fixture: ComponentFixture<EditarDiapositivasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarDiapositivasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarDiapositivasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
