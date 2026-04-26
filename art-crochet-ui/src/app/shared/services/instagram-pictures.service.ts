import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export type ProductType = string;

export interface InstagramPictureItem {
  source: 'instagram_graph_api';
  picture_url: string;
  permalink: string;
  caption?: string | null;
  timestamp: string;
  media_type: string;
  product_type: ProductType;
  product_variants?: string[];
}

interface InstagramPicturesResponse {
  pictures: InstagramPictureItem[];
}

@Injectable({
  providedIn: 'root',
})
export class InstagramPicturesService {
  private readonly http = inject(HttpClient);
  private static readonly CACHE_TTL_MS = 10 * 60 * 1000;

  private cachedPictures: InstagramPictureItem[] | null = null;
  private cacheExpiresAt = 0;
  private inFlightRequest: Promise<InstagramPictureItem[]> | null = null;

  async getLatestPictures(forceRefresh = false): Promise<InstagramPictureItem[]> {
    const now = Date.now();
    const cachedPictures = this.cachedPictures;

    if (!forceRefresh && cachedPictures !== null && now < this.cacheExpiresAt) {
      return cachedPictures;
    }

    if (!forceRefresh && this.inFlightRequest) {
      return this.inFlightRequest;
    }

    const request = this.fetchLatestPictures();
    this.inFlightRequest = request;

    try {
      const pictures = await request;
      this.cachedPictures = pictures;
      this.cacheExpiresAt = Date.now() + InstagramPicturesService.CACHE_TTL_MS;
      return pictures;
    } finally {
      this.inFlightRequest = null;
    }
  }

  private async fetchLatestPictures(): Promise<InstagramPictureItem[]> {
    const response = await firstValueFrom(
      this.http.get<InstagramPicturesResponse>('/api/instagram/pictures'),
    );

    return response.pictures;
  }
}
