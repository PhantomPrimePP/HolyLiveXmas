import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftUpload } from './gift-upload';

describe('GiftUpload', () => {
  let component: GiftUpload;
  let fixture: ComponentFixture<GiftUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GiftUpload]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GiftUpload);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
