import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Type,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import {
  InstagramPictureItem,
  InstagramPicturesService,
  ProductType,
} from '../../../../shared/services/instagram-pictures.service';
import { BucketHat } from '../bucket-hat/bucket-hat';
import { DiamondToteBag } from '../diamond-tote-bag/diamond-tote-bag';
import { MiniToteBag } from '../mini-tote-bag/mini-tote-bag';
import { OreoBag } from '../oreo-bag/oreo-bag';
import { ThreeLayerToteBag } from '../3-layer-tote-bag/3-layer-tote-bag';

const DETAIL_COMPONENT_REGISTRY: Partial<Record<ProductType, Type<unknown>>> = {
  'bucket-hat': BucketHat,
  'diamond-tote-bag': DiamondToteBag,
  'mini-tote-bag': MiniToteBag,
  'oreo-bag': OreoBag,
  '3-layer-tote-bag': ThreeLayerToteBag,
};

const REGISTERED_PRODUCT_TYPES = Object.keys(DETAIL_COMPONENT_REGISTRY) as ProductType[];

const RECENT_PRODUCT_TYPE_KEY = 'recentSelectedProductType';

interface ProductOption {
  value: ProductType;
  label: string;
}

function toProductLabel(productType: ProductType): string {
  return productType
    .split('-')
    .filter((segment) => segment.length > 0)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

@Component({
  selector: 'app-detail',
  imports: [
    NgComponentOutlet,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './details.html',
  styleUrl: './details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Details implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly instagramPicturesService = inject(InstagramPicturesService);

  readonly pictures = signal<InstagramPictureItem[]>([]);
  readonly isLoadingPictures = signal(true);
  readonly selectedProductType = signal<ProductType | null>(null);

  readonly productOptions = computed<ProductOption[]>(() => {
    const types = new Set<ProductType>(REGISTERED_PRODUCT_TYPES);

    for (const picture of this.pictures()) {
      if (picture.product_type) {
        types.add(picture.product_type);
      }
    }

    const options = Array.from(types);

    return options.map((value) => ({ value, label: toProductLabel(value) }));
  });

  readonly currentDetailComponent = computed<Type<unknown> | null>(() => {
    const type = this.selectedProductType();
    if (!type) return null;
    return DETAIL_COMPONENT_REGISTRY[type] ?? null;
  });

  readonly filteredPictures = computed(() =>
    this.pictures().filter((p) => p.product_type === this.selectedProductType()),
  );

  readonly productVariants = computed<string[]>(() => {
    const variants = new Set<string>();

    for (const picture of this.filteredPictures()) {
      for (const variant of picture.product_variants ?? []) {
        const normalizedVariant = variant.trim();
        if (normalizedVariant) {
          variants.add(normalizedVariant);
        }
      }
    }

    return Array.from(variants).sort((a, b) => a.localeCompare(b));
  });

  readonly collageImages = computed(() => this.filteredPictures().slice(0, 5));

  readonly detailComponentInputs = computed<Record<string, unknown>>(() => {
    if (!this.currentDetailComponent()) {
      return {};
    }

    return {
      variants: this.productVariants(),
    };
  });

  readonly isUnknownType = computed(() => {
    const type = this.selectedProductType();
    if (!type) return false;
    return this.productOptions().length > 0 && !this.productOptions().some((o) => o.value === type);
  });

  constructor() {
    effect(() => {
      const productType = this.selectedProductType();
      if (!productType) {
        return;
      }

      this.cacheSelectedProductType(productType);
    });
  }

  async ngOnInit() {
    const paramType = this.route.snapshot.paramMap.get('productType');
    const cachedProductType = this.getCachedProductType();

    try {
      const pictures = await this.instagramPicturesService.getLatestPictures();
      this.pictures.set(pictures);
    } catch {
      // Pictures are supplementary on this page; silently degrade.
    } finally {
      this.isLoadingPictures.set(false);
    }

    const requestedProductType = paramType ?? cachedProductType;

    if (
      requestedProductType &&
      this.productOptions().some((option) => option.value === requestedProductType)
    ) {
      this.selectedProductType.set(requestedProductType);
      return;
    }

    const first = this.productOptions()[0]?.value ?? null;
    this.selectedProductType.set(first);
  }

  handleProductTypeSelection(productType: ProductType | null): void {
    if (!productType) return;
    this.selectedProductType.set(productType);
    this.router.navigate(['/details', productType], { replaceUrl: true });
  }

  private getCachedProductType(): ProductType | null {
    try {
      return sessionStorage.getItem(RECENT_PRODUCT_TYPE_KEY);
    } catch {
      return null;
    }
  }

  private cacheSelectedProductType(productType: ProductType): void {
    try {
      sessionStorage.setItem(RECENT_PRODUCT_TYPE_KEY, productType);
    } catch {
      // Ignore storage failures.
    }
  }
}
