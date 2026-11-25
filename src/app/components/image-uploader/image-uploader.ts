import { Component, inject, model, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ImageUploadService } from '../image-upload.service';


const MAX_BYTES = 5 * 1024 * 1024; // 5 MB per image

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.html',
  styleUrl: './image-uploader.css',
})
export class ImageUploader {
  readonly images = model<string[]>([]);

  private readonly uploader = inject(ImageUploadService);
  protected readonly uploading = signal(false);
  protected readonly error = signal('');

  protected onFiles(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = ''; // lets the same file be picked again later
    if (files.length === 0) return;

    if (files.some((f) => !f.type.startsWith('image/'))) {
      this.error.set('Only image files are allowed.');
      return;
    }
    if (files.some((f) => f.size > MAX_BYTES)) {
      this.error.set('Each image must be 5 MB or smaller.');
      return;
    }

    this.uploading.set(true);
    this.error.set('');
    forkJoin(files.map((f) => this.uploader.upload(f))).subscribe({
      next: (urls) => {
        this.images.update((list) => [...list, ...urls]);
        this.uploading.set(false);
      },
      error: () => {
        this.uploading.set(false);
        this.error.set('Upload failed. Check your Cloudinary cloud name and preset.');
      },
    });
  }

  protected remove(index: number) {
    this.images.update((list) => list.filter((_, i) => i !== index));
  }

  protected makeFirst(index: number) {
    this.images.update((list) => [list[index], ...list.filter((_, i) => i !== index)]);
  }
}