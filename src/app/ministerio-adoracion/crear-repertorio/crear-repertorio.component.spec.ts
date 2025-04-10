import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearRepertorioComponent } from './crear-repertorio.component';

describe('CrearRepertorioComponent', () => {
  let component: CrearRepertorioComponent;
  let fixture: ComponentFixture<CrearRepertorioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearRepertorioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearRepertorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
