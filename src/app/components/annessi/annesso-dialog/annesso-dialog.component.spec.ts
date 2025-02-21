import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnessoDialogComponent } from './annesso-dialog.component';

describe('AnnessoDialogComponent', () => {
  let component: AnnessoDialogComponent;
  let fixture: ComponentFixture<AnnessoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnessoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnessoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
