import { Component, OnInit, inject, signal } from '@angular/core';
import {
  InstagramPictureItem,
  InstagramPicturesService,
} from '../../../../shared/services/instagram-pictures.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly instagramPicturesService = inject(InstagramPicturesService);

  readonly pictures = signal<InstagramPictureItem[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  async ngOnInit() {
    try {
      const pictures = await this.instagramPicturesService.getLatestNinePictures();
      this.pictures.set(pictures);
    } catch {
      this.errorMessage.set('Could not load Instagram pictures.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
