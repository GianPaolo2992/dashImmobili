import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImmobiliComponent } from './immobili.component';

describe('ImmobiliComponent', () => {
  let component: ImmobiliComponent;
  let fixture: ComponentFixture<ImmobiliComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImmobiliComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImmobiliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
