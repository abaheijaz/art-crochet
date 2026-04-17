import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { InstagramPictureItem } from '../../../../shared/services/instagram-pictures.service';

export type PicturePickDialogResult = 'instagram' | 'product-detail';

export interface PicturePickDialogData {
  picture: InstagramPictureItem;
}

@Component({
  selector: 'app-picture-pick-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './picture-pick-dialog.html',
  styleUrl: './picture-pick-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PicturePickDialog {
  private readonly dialogRef =
    inject<MatDialogRef<PicturePickDialog, PicturePickDialogResult>>(MatDialogRef);

  readonly data = inject<PicturePickDialogData>(MAT_DIALOG_DATA);

  choose(result: PicturePickDialogResult): void {
    this.dialogRef.close(result);
  }
}
