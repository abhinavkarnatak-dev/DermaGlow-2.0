/**
 * Client-side image handling. We compress and resize the selfie in the browser
 * before it ever leaves the device, so uploads are small and the API payload
 * stays light. Returns a JPEG data URL.
 */

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export class ImageError extends Error {}

export async function fileToCompressedDataUrl(
  file: File,
  { maxDim = 1024, quality = 0.82, maxInputBytes = 10 * 1024 * 1024 } = {},
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new ImageError("Please choose an image file.");
  }
  if (file.size > maxInputBytes) {
    throw new ImageError("That image is too large. Please use one under 10 MB.");
  }

  const bitmap = await loadBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new ImageError("Could not process that image.");
  ctx.drawImage(bitmap, 0, 0, width, height);
  if ("close" in bitmap) (bitmap as ImageBitmap).close?.();

  const dataUrl = canvas.toDataURL("image/jpeg", quality);
  if (!dataUrl.startsWith("data:image/")) {
    throw new ImageError("Could not read that image. Try a different file.");
  }
  return dataUrl;
}

async function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file);
    } catch {
      // Fall through to the <img> path (e.g. some formats/browsers).
    }
  }
  return await new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new ImageError("Could not read that image. Try a different file."));
    };
    img.src = url;
  });
}
