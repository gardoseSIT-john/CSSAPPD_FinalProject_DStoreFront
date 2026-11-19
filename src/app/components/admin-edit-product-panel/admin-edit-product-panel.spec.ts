import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminEditProductPanel } from './admin-edit-product-panel';

describe('AdminEditProductPanel', () => {
  let component: AdminEditProductPanel;
  let fixture: ComponentFixture<AdminEditProductPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEditProductPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminEditProductPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
