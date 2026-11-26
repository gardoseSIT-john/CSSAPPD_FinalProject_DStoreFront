import { Component, DestroyRef, ElementRef, afterNextRender, inject, signal } from '@angular/core';
import { BRAND } from '../brand.config';

@Component({
  selector: 'app-ceo-note',
  imports: [],
  templateUrl: './ceo-note.html',
  styleUrl: './ceo-note.css',
})
export class CeoNote {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly brand = BRAND;
  protected readonly ceo = BRAND.ceo;
  protected readonly initials = BRAND.ceo.name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // fall back to initials / a handwritten font if the pictures are not added yet
  protected readonly photoFailed = signal(false);
  protected readonly signatureFailed = signal(false);

  // becomes true when the note scrolls into view, which "writes" the signature
  protected readonly seen = signal(false);

  constructor() {
    afterNextRender(() => {
      if (typeof IntersectionObserver === 'undefined') {
        this.seen.set(true);
        return;
      }
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            this.seen.set(true);
            observer.disconnect();
          }
        },
        { threshold: 0.35 },
      );
      observer.observe(this.host.nativeElement);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
