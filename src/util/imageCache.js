// 간단한 ImageBitmap 캐시 (URL, File 대응)
const cache = new Map<string, ImageBitmap>();

export async function loadImageBitmap(src: string | File): Promise<{ key: string; bmp: ImageBitmap }> {
  let key: string; let bmp: ImageBitmap | undefined;

  if (src instanceof File) {
    key = `file:${src.name}:${src.size}:${src.lastModified}`;
    bmp = cache.get(key);
    if (bmp) return { key, bmp };
    const blob = src;
    const bitmap = await createImageBitmap(blob);
    cache.set(key, bitmap);
    return { key, bmp: bitmap };
  } else {
    key = `url:${src}`;
    bmp = cache.get(key);
    if (bmp) return { key, bmp };
    const img = await fetch(src).then(r => r.blob());
    const bitmap = await createImageBitmap(img);
    cache.set(key, bitmap);
    return { key, bmp: bitmap };
  }
}

export function getCachedBitmap(key: string) {
  return cache.get(key) || null;
}

export function revokeBitmap(key: string) {
  const b = cache.get(key);
  if (b) {
    // ImageBitmap은 close() 가능
    try { (b as any).close?.(); } catch {}
    cache.delete(key);
  }
}
