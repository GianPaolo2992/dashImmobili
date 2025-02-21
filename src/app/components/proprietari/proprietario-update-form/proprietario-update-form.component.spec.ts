import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProprietarioUpdateFormComponent } from './proprietario-update-form.component';

describe('ProprietarioUpdateFormComponent', () => {
  let component: ProprietarioUpdateFormComponent;
  let fixture: ComponentFixture<ProprietarioUpdateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProprietarioUpdateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProprietarioUpdateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
