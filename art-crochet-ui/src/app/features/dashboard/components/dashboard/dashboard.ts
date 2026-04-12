import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
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

const PRODUCT_TABS: ProductTab[] = [
  {
    value: 'bag',
    label: 'Bag',
    emptyState: 'No bag pictures are available yet.',
  },
  {
    value: 'bucket-hat',
    label: 'Bucket Hat',
    emptyState: 'No bucket hat pictures are available yet.',
  },
  {
    value: 'coaster',
    label: 'Coaster',
    emptyState: 'No coaster pictures are available yet.',
  },
  {
    value: 'lipbalm-holder',
    label: 'Lipbalm Holder',
    emptyState: 'No lipbalm holder pictures are available yet.',
  },
  {
    value: 'others',
    label: 'Others',
    emptyState: 'No other crochet pictures are available yet.',
  },
];

const PICTURE_BATCH_SIZE = 12;

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  private readonly instagramPicturesService = inject(InstagramPicturesService);
  readonly scrollSentinel = viewChild<ElementRef<HTMLDivElement>>('scrollSentinel');

  readonly productTabs = PRODUCT_TABS;
  readonly pictures = signal<InstagramPictureItem[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly selectedProductType = signal<ProductType>('bag');
  readonly visiblePictureCount = signal(PICTURE_BATCH_SIZE);
  readonly filteredPictures = computed(() =>
    this.pictures().filter((picture) => picture.product_type === this.selectedProductType()),
  );
  readonly visiblePictures = computed(() =>
    this.filteredPictures().slice(0, this.visiblePictureCount()),
  );
  readonly productTabsWithCounts = computed(() =>
    this.productTabs.map((tab) => ({
      ...tab,
      count: this.pictures().filter((picture) => picture.product_type === tab.value).length,
    })),
  );
  readonly hasMorePictures = computed(
    () => this.visiblePictures().length < this.filteredPictures().length,
  );
  readonly selectedTabEmptyState = computed(
    () =>
      this.productTabs.find((tab) => tab.value === this.selectedProductType())?.emptyState ??
      'No pictures are available yet.',
  );

  constructor() {
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

  selectProductType(productType: ProductType) {
    this.selectedProductType.set(productType);
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
