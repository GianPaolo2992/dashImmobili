import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProprietariComponent } from './proprietari.component';

describe('ProprietariComponent', () => {
  let component: ProprietariComponent;
  let fixture: ComponentFixture<ProprietariComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProprietariComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProprietariComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
