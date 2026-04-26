import { effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const THEME_KEY = 'art-crochet-theme';
const DARK_ATTR = 'dark-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);

  private readonly _isDark = signal(this.resolveInitialTheme());

  readonly isDark = this._isDark.asReadonly();

  constructor() {
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        if (this._isDark()) {
          document.documentElement.setAttribute('theme', DARK_ATTR);
          localStorage.setItem(THEME_KEY, 'dark');
        } else {
          document.documentElement.removeAttribute('theme');
          localStorage.setItem(THEME_KEY, 'light');
        }
      }
    });
  }

  toggle(): void {
    this._isDark.update((v) => !v);
  }

  private resolveInitialTheme(): boolean {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === 'dark') return true;
      if (stored === 'light') return false;
    }
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  }
}
