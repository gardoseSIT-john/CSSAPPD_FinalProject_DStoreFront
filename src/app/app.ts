import { Component, DOCUMENT, effect, inject, signal } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Intro } from './components/intro/intro';
import { SiteHeader } from './components/site-header/site-header';
import { SiteFooter } from './components/site-footer/site-footer';

const INTRO_KEY = 'introSeen';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Intro, SiteHeader, SiteFooter],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly document = inject(DOCUMENT);

  // the welcome intro plays once per browser tab, and never on admin pages
  protected readonly showIntro = signal(this.shouldShowIntro());

  constructor() {
    // keep anchor links (#shop, #collections) from hiding under the sticky header
    inject(ViewportScroller).setOffset([0, 80]);

    // while the intro is up, the page behind it can't scroll and the hero waits
    effect(() => this.document.body.classList.toggle('intro-open', this.showIntro()));
  }

  protected onIntroDone(): void {
    this.showIntro.set(false);
    try {
      sessionStorage.setItem(INTRO_KEY, 'yes');
    } catch {
      // storage blocked: the intro just shows again next time
    }
  }

  private shouldShowIntro(): boolean {
    if (this.document.location.pathname.startsWith('/admin')) {
      return false;
    }
    try {
      return sessionStorage.getItem(INTRO_KEY) !== 'yes';
    } catch {
      return true;
    }
  }
}
