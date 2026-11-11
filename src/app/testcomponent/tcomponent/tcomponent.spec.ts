import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tcomponent } from './tcomponent';

describe('Tcomponent', () => {
  let component: Tcomponent;
  let fixture: ComponentFixture<Tcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tcomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Tcomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
