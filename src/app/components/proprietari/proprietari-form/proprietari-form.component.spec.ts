import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProprietariFormComponent } from './proprietari-form.component';

describe('ProprietariFormComponent', () => {
  let component: ProprietariFormComponent;
  let fixture: ComponentFixture<ProprietariFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProprietariFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProprietariFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
