export interface Product {
  _id: string;
  name: string;
  size: string[];
  description: string;
  tags: string[];
  images: string[];
  price: number;
  //Added in F[4]
  status: 'available' | 'reserved' | 'sold';
  isActive: boolean;
  removedAt: string | null;
}
export interface ProductInput {
  name: string;
  size: string[];
  description: string;
  tags: string[];
  images: string[];
  price: number;
}

/** "S, M, L" -> ['S','M','L'] (also used for newline-separated image URLs) */
export function splitList(text: string, separator: RegExp): string[] {
  return text.split(separator).map((s) => s.trim()).filter(Boolean);
}