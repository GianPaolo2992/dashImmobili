import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnessiUpdateFormComponent } from './annessi-update-form.component';

describe('AnnessiUpdateFormComponent', () => {
  let component: AnnessiUpdateFormComponent;
  let fixture: ComponentFixture<AnnessiUpdateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnessiUpdateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnessiUpdateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
