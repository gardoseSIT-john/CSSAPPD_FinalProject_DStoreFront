import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCell } from './product-cell';

describe('ProductCell', () => {
  let component: ProductCell;
  let fixture: ComponentFixture<ProductCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCell],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCell);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
