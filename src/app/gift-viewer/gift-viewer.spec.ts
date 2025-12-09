import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftViewer } from './gift-viewer';

describe('GiftViewer', () => {
  let component: GiftViewer;
  let fixture: ComponentFixture<GiftViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GiftViewer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GiftViewer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
