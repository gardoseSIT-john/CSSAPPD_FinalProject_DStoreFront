import { Component, ElementRef, afterNextRender, inject, output, signal } from '@angular/core';
import { BRAND } from '../brand.config';

@Component({
  selector: 'app-intro',
  imports: [],
  templateUrl: './intro.html',
  styleUrl: './intro.css',
  host: {
    role: 'button',
    tabindex: '0',
    '[attr.aria-label]': 'stage() === 1 ? "Welcome. Press to continue" : "Press to enter the store"',
    '[class.leaving]': 'leaving()',
    '(click)': 'next()',
    '(keydown.enter)': 'next()',
    '(keydown.space)': 'next()',
  },
})
export class Intro {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly brand = BRAND;

  // 1 = "Welcome" screen, 2 = "This is D STORE" screen
  protected readonly stage = signal(1);
  protected readonly leaving = signal(false);
  readonly finished = output<void>();

  constructor() {
    // focus the intro when it appears so Enter / Space also work
    afterNextRender(() => this.el.nativeElement.focus());
  }

  protected next(): void {
    if (this.stage() === 1) {
      this.stage.set(2);
      return;
    }
    if (!this.leaving()) {
      this.leaving.set(true);
      setTimeout(() => this.finished.emit(), 800);
    }
  }
}
