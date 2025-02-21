import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImmobileUpdateFormComponent } from './immobile-update-form.component';

describe('ImmobileUpdateFormComponent', () => {
  let component: ImmobileUpdateFormComponent;
  let fixture: ComponentFixture<ImmobileUpdateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImmobileUpdateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImmobileUpdateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
