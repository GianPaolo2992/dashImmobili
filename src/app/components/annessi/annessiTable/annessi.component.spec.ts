import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnessiComponent } from './annessi.component';

describe('AnnessiComponent', () => {
  let component: AnnessiComponent;
  let fixture: ComponentFixture<AnnessiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnessiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnessiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
