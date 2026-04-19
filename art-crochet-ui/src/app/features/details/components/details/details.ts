import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Type,
  computed,
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
import { MiniToteBag } from '../mini-tote-bag/mini-tote-bag';
import { BucketHat } from '../bucket-hat/bucket-hat';
import { PhoneBag } from '../phone-bag/phone-bag';

const DETAIL_COMPONENT_REGISTRY: Partial<Record<ProductType, Type<unknown>>> = {
  'mini-tote-bag': MiniToteBag,
  'bucket-hat': BucketHat,
  'phone-bag': PhoneBag,
};

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
    const types = Array.from(
      new Set(
        this.pictures()
          .map((p) => p.product_type)
          .filter(Boolean),
      ),
    );
    return types.map((value) => ({ value, label: toProductLabel(value) }));
  });

  readonly currentDetailComponent = computed<Type<unknown> | null>(() => {
    const type = this.selectedProductType();
    if (!type) return null;
    return DETAIL_COMPONENT_REGISTRY[type] ?? null;
  });

  readonly filteredPictures = computed(() =>
    this.pictures().filter((p) => p.product_type === this.selectedProductType()),
  );

  readonly collageImages = computed(() => this.filteredPictures().slice(0, 5));

  readonly isUnknownType = computed(() => {
    const type = this.selectedProductType();
    if (!type) return false;
    return this.productOptions().length > 0 && !this.productOptions().some((o) => o.value === type);
  });

  async ngOnInit() {
    const paramType = this.route.snapshot.paramMap.get('productType');

    try {
      const pictures = await this.instagramPicturesService.getLatestPictures();
      this.pictures.set(pictures);
    } catch {
      // Pictures are supplementary on this page; silently degrade.
    } finally {
      this.isLoadingPictures.set(false);
    }

    if (paramType) {
      this.selectedProductType.set(paramType);
    } else {
      const first = this.productOptions()[0]?.value ?? null;
      this.selectedProductType.set(first);
    }
  }

  handleProductTypeSelection(productType: ProductType | null): void {
    if (!productType) return;
    this.selectedProductType.set(productType);
    this.router.navigate(['/details', productType], { replaceUrl: true });
  }
}
