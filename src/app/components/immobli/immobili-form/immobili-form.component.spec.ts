import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImmobiliFormComponent } from './immobili-form.component';

describe('ImmobiliFormComponent', () => {
  let component: ImmobiliFormComponent;
  let fixture: ComponentFixture<ImmobiliFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImmobiliFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImmobiliFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
