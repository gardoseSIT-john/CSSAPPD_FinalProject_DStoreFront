import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { CLOUDINARY } from './cloudinary.config';

@Service()
export class ImageUploadService {
  private readonly http = inject(HttpClient);

  /** Uploads one image and returns its https URL. */
  upload(file: File) {
    const body = new FormData();
    body.append('file', file);
    body.append('upload_preset', CLOUDINARY.uploadPreset);

    return this.http
      .post<{ secure_url: string }>(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY.cloudName}/image/upload`,
        body,
      )
      .pipe(map((res) => res.secure_url));
  }
}