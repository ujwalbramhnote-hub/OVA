const BACKEND_ORIGIN = 'http://localhost:8181';

export const resolveImageSrc = (imageUrl, fallback = '/candidate-placeholder.svg') => {
  if (!imageUrl) {
    return fallback;
  }

  if (
    imageUrl.startsWith('http://') ||
    imageUrl.startsWith('https://') ||
    imageUrl.startsWith('data:') ||
    imageUrl.startsWith('blob:')
  ) {
    return imageUrl;
  }

  if (imageUrl.startsWith('/uploads/')) {
    return `${BACKEND_ORIGIN}${imageUrl}`;
  }

  return imageUrl.startsWith('/') ? imageUrl : `${BACKEND_ORIGIN}/${imageUrl}`;
};
