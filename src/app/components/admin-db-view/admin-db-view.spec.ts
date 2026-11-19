import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDbView } from './admin-db-view';

describe('AdminDbView', () => {
  let component: AdminDbView;
  let fixture: ComponentFixture<AdminDbView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDbView],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDbView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
