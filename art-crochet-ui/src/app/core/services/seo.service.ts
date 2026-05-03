import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';

const SITE_NAME = 'Made By Xima';
const SITE_URL = 'https://www.madebyxima.com';
const DEFAULT_DESCRIPTION = 'Handmade crochet pieces, stories, and inspiration from Made By Xima.';

type SeoState = {
  title: string;
  description: string;
};

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly title = inject(Title);

  constructor() {
    this.updateSeo();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateSeo();
      }
    });
  }

  private updateSeo(): void {
    const activeRoute = this.getActiveRoute(this.router.routerState.snapshot.root);
    const seoState = this.resolveSeoState(activeRoute);
    const canonicalUrl = this.resolveCanonicalUrl();

    this.title.setTitle(seoState.title);
    this.meta.updateTag({ name: 'description', content: seoState.description });
    this.meta.updateTag({ name: 'robots', content: 'index,follow' });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
    this.meta.updateTag({ property: 'og:title', content: seoState.title });
    this.meta.updateTag({ property: 'og:description', content: seoState.description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:title', content: seoState.title });
    this.meta.updateTag({ name: 'twitter:description', content: seoState.description });
    this.updateCanonicalLink(canonicalUrl);
  }

  private getActiveRoute(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    let activeRoute = route;

    while (activeRoute.firstChild) {
      activeRoute = activeRoute.firstChild;
    }

    return activeRoute;
  }

  private resolveSeoState(route: ActivatedRouteSnapshot): SeoState {
    const productType = route.paramMap.get('productType');

    if (route.routeConfig?.path === 'details/:productType' && productType) {
      const productLabel = this.toProductLabel(productType);

      return {
        title: `${productLabel} | ${SITE_NAME}`,
        description: `Browse sizes, materials, and ordering details for the ${productLabel.toLowerCase()} handmade crochet piece from ${SITE_NAME}.`,
      };
    }

    const routeDescription = route.data['description'];
    const description =
      typeof routeDescription === 'string' && routeDescription.trim().length > 0
        ? routeDescription
        : DEFAULT_DESCRIPTION;
    const routeTitle = typeof route.title === 'string' && route.title.trim().length > 0 ? route.title : SITE_NAME;

    return {
      title: routeTitle,
      description,
    };
  }

  private resolveCanonicalUrl(): string {
    const path = this.document.location.pathname || '/';
    return new URL(path, SITE_URL).toString();
  }

  private updateCanonicalLink(href: string): void {
    let canonicalLink = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!canonicalLink) {
      canonicalLink = this.document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      this.document.head.appendChild(canonicalLink);
    }

    canonicalLink.setAttribute('href', href);
  }

  private toProductLabel(productType: string): string {
    return productType
      .split('-')
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' ');
  }
}