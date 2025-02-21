import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImmobileDialogComponent } from './immobile-dialog.component';

describe('ProprietarioDialogComponent', () => {
  let component: ImmobileDialogComponent;
  let fixture: ComponentFixture<ImmobileDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImmobileDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImmobileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
