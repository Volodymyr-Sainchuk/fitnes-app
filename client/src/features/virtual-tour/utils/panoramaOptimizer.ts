const optimizedPanoramaCache = new Map<string, Promise<string>>();

async function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Cannot load image: ${source}`));
    image.src = source;
  });
}

function compressToJpegBlob(image: HTMLImageElement, maxWidth: number, quality: number): Promise<Blob | null> {
  const ratio = image.width > maxWidth ? maxWidth / image.width : 1;
  const width = Math.max(1, Math.round(image.width * ratio));
  const height = Math.max(1, Math.round(image.height * ratio));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d", { alpha: false });
  if (!context) {
    return Promise.resolve(null);
  }

  context.drawImage(image, 0, 0, width, height);

  return new Promise((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", quality);
  });
}

export async function optimizePanorama(source: string): Promise<string> {
  if (source.endsWith(".svg")) {
    return source;
  }

  if (optimizedPanoramaCache.has(source)) {
    return optimizedPanoramaCache.get(source)!;
  }

  const pending = (async () => {
    try {
      const image = await loadImage(source);
      const blob = await compressToJpegBlob(image, 2200, 0.8);
      if (!blob) {
        return source;
      }

      return URL.createObjectURL(blob);
    } catch {
      return source;
    }
  })();

  optimizedPanoramaCache.set(source, pending);
  return pending;
}

export function preloadPanoramas(sources: string[]): void {
  for (const source of sources) {
    void optimizePanorama(source);
  }
}
