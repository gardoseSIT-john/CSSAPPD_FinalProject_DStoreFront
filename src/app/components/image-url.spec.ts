import { cloudinaryUrl, IMG } from './image-url';

describe('cloudinaryUrl', () => {
  const plain =
    'https://res.cloudinary.com/kggzq6ec/image/upload/v1795656469/ijt5on4i6rglmdv1cahk.jpg';

  it('inserts the transformation after /upload/', () => {
    expect(cloudinaryUrl(plain, IMG.card)).toBe(
      'https://res.cloudinary.com/kggzq6ec/image/upload/f_auto,q_auto,w_400,h_400,c_fill/v1795656469/ijt5on4i6rglmdv1cahk.jpg',
    );
  });

  it('builds a larger version for the details page', () => {
    expect(cloudinaryUrl(plain, IMG.detail)).toContain('/upload/f_auto,q_auto,w_800,h_800,c_fill/');
  });

  it('leaves other addresses unchanged', () => {
    const other = 'https://picsum.photos/seed/tee/400';
    expect(cloudinaryUrl(other, IMG.card)).toBe(other);
  });

  it('handles an empty value', () => {
    expect(cloudinaryUrl('', IMG.card)).toBe('');
  });
});