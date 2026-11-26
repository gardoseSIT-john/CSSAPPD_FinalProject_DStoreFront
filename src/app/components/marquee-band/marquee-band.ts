import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-marquee-band',
  imports: [],
  templateUrl: './marquee-band.html',
  styleUrl: './marquee-band.css',
})
export class MarqueeBand {
  readonly items = input.required<string[]>();
  readonly size = input<'small' | 'large'>('small');
  readonly reverse = input(false);

  // repeat the words so the strip is always wider than the screen,
  // then double it so the loop has no visible jump
  protected readonly loop = computed(() => {
    const items = this.items();
    if (items.length === 0) {
      return [];
    }
    let base = [...items];
    while (base.length < 8) {
      base = [...base, ...items];
    }
    return [...base, ...base];
  });
}
