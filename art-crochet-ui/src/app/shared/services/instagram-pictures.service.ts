import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export type ProductType = 'bag' | 'bucket-hat' | 'coaster' | 'lipbalm-holder' | 'others';

export interface InstagramPictureItem {
  source: 'instagram_graph_api';
  picture_url: string;
  permalink: string;
  caption?: string | null;
  timestamp: string;
  media_type: string;
  product_type: ProductType;
}

interface InstagramPicturesResponse {
  pictures: InstagramPictureItem[];
}

@Injectable({
  providedIn: 'root',
})
export class InstagramPicturesService {
  private readonly http = inject(HttpClient);

  async getLatestPictures(): Promise<InstagramPictureItem[]> {
    const response = await firstValueFrom(
      this.http.get<InstagramPicturesResponse>('/api/instagram/pictures'),
    );

    return response.pictures;
  }
}
