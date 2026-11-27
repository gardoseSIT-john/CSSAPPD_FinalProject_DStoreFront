import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Product } from '../product.model';
import { OrderPage } from './order-page';

const sampleProduct: Product = {
  _id: '1',
  name: 'Denim Jacket',
  size: ['S', 'M'],
  description: 'Classic denim jacket.',
  tags: ['jackets'],
  images: ['https://picsum.photos/seed/jacket/400'],
  price: 1200,
  status: 'available',
  isActive: true,
  removedAt: null,
};

describe('OrderPage', () => {
  let component: OrderPage;
  let fixture: ComponentFixture<OrderPage>;
  let http: HttpTestingController;

  // Some test environments don't implement <dialog>.showModal(), so give them a stand-in
  beforeAll(() => {
    const proto = HTMLDialogElement.prototype as Partial<HTMLDialogElement>;
    proto.showModal ??= function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    };
    proto.close ??= function (this: HTMLDialogElement) {
      this.removeAttribute('open');
    };
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(OrderPage);
    component = fixture.componentInstance;

    // the required input must be set BEFORE the first render
    fixture.componentRef.setInput('product', sampleProduct);

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the product name in the heading', () => {
    const h2 = (fixture.nativeElement as HTMLElement).querySelector('h2')!;
    expect(h2.textContent).toContain('Denim Jacket');
  });

  it('does not send an order when the form is empty, and shows the errors', async () => {
    const el = fixture.nativeElement as HTMLElement;
    el.querySelector('form')!.dispatchEvent(new Event('submit'));
    await fixture.whenStable();

    expect(el.querySelectorAll('.error').length).toBeGreaterThan(0);
    http.expectNone(() => true); // nothing was sent to the server
  });
});