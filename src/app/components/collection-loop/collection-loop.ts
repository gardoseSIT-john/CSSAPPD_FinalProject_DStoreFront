import { Component, computed, input, output } from '@angular/core';
import { Product } from '../product.model';

interface CollectionTile {
  tag: string; // '' means all products
  label: string;
  image: string | null;
  count: number;
}

@Component({
  selector: 'app-collection-loop',
  imports: [],
  templateUrl: './collection-loop.html',
  styleUrl: './collection-loop.css',
})
export class CollectionLoop {
  readonly products = input.required<Product[]>();
  readonly picked = output<string>();

  // one tile per product tag, plus "All products" first
  protected readonly tiles = computed<CollectionTile[]>(() => {
    const list = this.products();
    if (list.length === 0) {
      return [];
    }

    const used = new Set<string>();
    const pickImage = (candidates: Product[]): string | null => {
      const fresh = candidates.find((p) => p.images.length > 0 && !used.has(p.images[0]));
      const chosen = fresh ?? candidates.find((p) => p.images.length > 0);
      const image = chosen?.images[0] ?? null;
      if (image) {
        used.add(image);
      }
      return image;
    };

    const byTag = new Map<string, Product[]>();
    for (const p of list) {
      for (const raw of p.tags) {
        const tag = raw.trim().toLowerCase();
        if (tag) {
          byTag.set(tag, [...(byTag.get(tag) ?? []), p]);
        }
      }
    }

    const all: CollectionTile = { tag: '', label: 'All products', image: pickImage(list), count: list.length };
    const tagTiles = [...byTag.entries()]
      .sort((a, b) => b[1].length - a[1].length)
      .map(([tag, items]) => ({ tag, label: tag, image: pickImage(items), count: items.length }));

    return [all, ...tagTiles];
  });

  // repeat the tiles so the moving strip never runs out, then double it for a smooth loop
  protected readonly loop = computed(() => {
    const tiles = this.tiles();
    if (tiles.length === 0) {
      return [];
    }
    let base = [...tiles];
    while (base.length < 10) {
      base = [...base, ...tiles];
    }
    return [...base, ...base];
  });
}
