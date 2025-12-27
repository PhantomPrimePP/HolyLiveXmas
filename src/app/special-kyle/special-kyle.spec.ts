import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialKyle } from './special-kyle';

describe('SpecialKyle', () => {
  let component: SpecialKyle;
  let fixture: ComponentFixture<SpecialKyle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialKyle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialKyle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
