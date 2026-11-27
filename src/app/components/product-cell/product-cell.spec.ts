import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Product } from '../product.model';
import { ProductCell } from './product-cell';

const sampleProduct: Product = {
  _id: '1',
  name: 'Denim Jacket',
  size: ['S', 'M'],
  description: 'Classic denim jacket.',
  tags: ['jackets'],
  images: [
    'https://res.cloudinary.com/kggzq6ec/image/upload/v1795656469/ijt5on4i6rglmdv1cahk.jpg',
  ],
  price: 1200,
  status: 'available',
  isActive: true,
  removedAt: null,
};

describe('ProductCell', () => {
  let component: ProductCell;
  let fixture: ComponentFixture<ProductCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCell],
      providers: [provideRouter([])], // ADDED: the cell uses routerLink
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCell);
    component = fixture.componentInstance;

    // ADDED: the required input must be set BEFORE the first render
    fixture.componentRef.setInput('product', sampleProduct);

    await fixture.whenStable(); // first render happens here
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('uses the product name as alt text, with width and height', () => {
    const img = (fixture.nativeElement as HTMLElement).querySelector('img')!;
    expect(img.getAttribute('alt')).toBe('Denim Jacket');
    expect(img.getAttribute('width')).toBe('400');
    expect(img.getAttribute('height')).toBe('400');
  });

  it('loads the small Cloudinary version', () => {
    const img = (fixture.nativeElement as HTMLElement).querySelector('img')!;
    expect(img.getAttribute('src')).toContain('/upload/f_auto,q_auto,w_400,h_400,c_fill/');
  });
});