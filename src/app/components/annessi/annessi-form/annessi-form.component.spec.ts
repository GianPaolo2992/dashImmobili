import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnessiFormComponent } from './annessi-form.component';

describe('AnnessiFormComponent', () => {
  let component: AnnessiFormComponent;
  let fixture: ComponentFixture<AnnessiFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnessiFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnessiFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
