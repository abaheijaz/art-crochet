import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  computed,
  effect,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import {
  PicturePickDialog,
  PicturePickDialogData,
} from '../picture-pick-dialog/picture-pick-dialog';

import {
  InstagramPictureItem,
  InstagramPicturesService,
  ProductType,
} from '../../../../shared/services/instagram-pictures.service';

interface ProductTab {
  value: ProductType;
  label: string;
  emptyState: string;
}

function toProductLabel(productType: ProductType): string {
  return productType
    .split('-')
    .filter((segment) => segment.length > 0)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

function toProductEmptyState(label: string): string {
  return `No ${label.toLowerCase()} pictures are available yet.`;
}

const PICTURE_BATCH_SIZE = 12;

@Component({
  selector: 'app-gallery',
  imports: [MatCardModule, MatFormFieldModule, MatOptionModule, MatSelectModule],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Gallery implements OnInit {
  private readonly instagramPicturesService = inject(InstagramPicturesService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  readonly scrollSentinel = viewChild<ElementRef<HTMLDivElement>>('scrollSentinel');

  readonly pictures = signal<InstagramPictureItem[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly selectedProductType = signal<ProductType | null>(null);
  readonly visiblePictureCount = signal(PICTURE_BATCH_SIZE);
  readonly productTabs = computed<ProductTab[]>(() => {
    const productTypes = Array.from(
      new Set(
        this.pictures()
          .map((picture) => picture.product_type)
          .filter(Boolean),
      ),
    );

    return productTypes.map((productType) => {
      const label = toProductLabel(productType);
      return {
        value: productType,
        label,
        emptyState: toProductEmptyState(label),
      };
    });
  });
  readonly filteredPictures = computed(() =>
    this.selectedProductType()
      ? this.pictures().filter((picture) => picture.product_type === this.selectedProductType())
      : [],
  );
  readonly visiblePictures = computed(() =>
    this.filteredPictures().slice(0, this.visiblePictureCount()),
  );
  readonly productTabsWithCounts = computed(() =>
    this.productTabs().map((tab) => ({
      ...tab,
      count: this.pictures().filter((picture) => picture.product_type === tab.value).length,
    })),
  );
  readonly selectedProductTab = computed(
    () =>
      this.productTabsWithCounts().find((tab) => tab.value === this.selectedProductType()) ?? null,
  );
  readonly hasMorePictures = computed(
    () => this.visiblePictures().length < this.filteredPictures().length,
  );
  readonly selectedTabEmptyState = computed(
    () =>
      this.productTabs().find((tab) => tab.value === this.selectedProductType())?.emptyState ??
      'No pictures are available yet.',
  );

  constructor() {
    effect(() => {
      const productTabs = this.productTabs();
      const selectedProductType = this.selectedProductType();

      if (productTabs.length === 0) {
        if (selectedProductType !== null) {
          untracked(() => {
            this.selectedProductType.set(null);
          });
        }
        return;
      }

      if (!selectedProductType || !productTabs.some((tab) => tab.value === selectedProductType)) {
        untracked(() => {
          this.selectedProductType.set(productTabs[0].value);
        });
      }
    });

    effect(() => {
      this.selectedProductType();

      untracked(() => {
        this.visiblePictureCount.set(PICTURE_BATCH_SIZE);
      });
    });

    effect((onCleanup) => {
      const sentinel = this.scrollSentinel()?.nativeElement;
      const isLoading = this.isLoading();
      const errorMessage = this.errorMessage();
      this.selectedProductType();

      if (!sentinel || isLoading || errorMessage) {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            this.loadMorePictures();
          }
        },
        {
          rootMargin: '320px 0px',
        },
      );

      observer.observe(sentinel);
      onCleanup(() => observer.disconnect());
    });
  }

  async ngOnInit() {
    try {
      const pictures = await this.instagramPicturesService.getLatestPictures();
      this.pictures.set(pictures);
    } catch {
      this.errorMessage.set('Could not load Instagram pictures.');
    } finally {
      this.isLoading.set(false);
    }
  }

  openPictureOptions(picture: InstagramPictureItem): void {
    const dialogRef = this.dialog.open<PicturePickDialog, PicturePickDialogData, string>(
      PicturePickDialog,
      {
        data: { picture },
        maxWidth: '24rem',
        width: 'calc(100% - 2rem)',
      },
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'instagram') {
        window.open(picture.permalink, '_blank', 'noopener,noreferrer');
      } else if (result === 'product-detail') {
        this.router.navigate(['/details', picture.product_type]);
      }
    });
  }

  selectProductType(productType: ProductType) {
    this.selectedProductType.set(productType);
  }

  handleProductTypeSelection(productType: ProductType | null) {
    if (!productType) {
      return;
    }

    this.selectProductType(productType);
  }

  private loadMorePictures() {
    if (!this.hasMorePictures()) {
      return;
    }

    this.visiblePictureCount.update((currentCount) =>
      Math.min(currentCount + PICTURE_BATCH_SIZE, this.filteredPictures().length),
    );
  }
}
