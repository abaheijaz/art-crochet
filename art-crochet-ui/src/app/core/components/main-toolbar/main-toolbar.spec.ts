import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainToolbar } from './main-toolbar';

describe('MainToolbar', () => {
  let component: MainToolbar;
  let fixture: ComponentFixture<MainToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainToolbar],
    }).compileComponents();

    fixture = TestBed.createComponent(MainToolbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
