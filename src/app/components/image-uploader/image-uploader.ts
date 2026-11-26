import { Component, computed, inject, model, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ImageUploadService } from '../image-upload.service';

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_IMAGES = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

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

  protected readonly maxImages = MAX_IMAGES;
  protected readonly isFull = computed(() => this.images().length >= MAX_IMAGES);
  protected readonly remaining = computed(() => MAX_IMAGES - this.images().length);

  protected onFiles(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = ''; // lets the same file be picked again later
    if (files.length === 0) return;

    //First, we validate everything, so one bad file means nothing is uploaded
    if (files.some((f) => !ALLOWED_TYPES.includes(f.type))) {
      this.error.set('Only JPG, PNG or WebP images are allowed.');
      return;
    }
    if (files.some((f) => f.size > MAX_BYTES)) {
      this.error.set('Each image must be 5 MB or smaller.');
      return;
    }
    if (files.length > this.remaining()) {
      this.error.set(`You can add ${this.remaining()} more image(s) (maximum ${MAX_IMAGES}).`);
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

  //Remove Image function
  protected remove(index: number) {
    if (this.images().length <= 1) return; // a product keeps at least one image
    this.images.update((list) => list.filter((_, i) => i !== index));
  }

  protected makeFirst(index: number) {
    this.images.update((list) => [list[index], ...list.filter((_, i) => i !== index)]);
  }
}