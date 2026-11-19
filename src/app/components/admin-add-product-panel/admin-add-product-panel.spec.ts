import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminAddProductPanel } from './admin-add-product-panel';

describe('AdminAddProductPanel', () => {
  let component: AdminAddProductPanel;
  let fixture: ComponentFixture<AdminAddProductPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAddProductPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminAddProductPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
