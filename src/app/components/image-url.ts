const MARKER = '/upload/';

// f_auto = best format (WebP/AVIF), q_auto = best quality/size balance,
// c_fill with matching w/h = exact crop, so the sizes in the templates are true
export const IMG = {
  card: 'f_auto,q_auto,w_400,h_400,c_fill',
  detail: 'f_auto,q_auto,w_800,h_800,c_fill',
  thumb: 'f_auto,q_auto,w_128,h_128,c_fill',
} as const;

/**
 * Inserts a transformation after /upload/ in a Cloudinary URL.
 * The database keeps the plain URL. Any other address (such as the picsum seed images)
 * is returned unchanged.
 */
export function cloudinaryUrl(url: string, transform: string): string {
  if (!url.startsWith('https://res.cloudinary.com/')) return url;
  const i = url.indexOf(MARKER);
  if (i === -1) return url;
  const end = i + MARKER.length;
  return `${url.slice(0, end)}${transform}/${url.slice(end)}`;
}