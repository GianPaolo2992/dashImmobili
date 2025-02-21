import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProprietarioDialogComponent } from './proprietario-dialog.component';

describe('ProprietarioDialogComponent', () => {
  let component: ProprietarioDialogComponent;
  let fixture: ComponentFixture<ProprietarioDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProprietarioDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProprietarioDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
