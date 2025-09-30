const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const getImageUrl = (filename?: string | null): string | null => {
  if (!filename) return null;
  if (filename.startsWith("http://") || filename.startsWith("https://")) {
    return filename;
  }
  return `${BASE_URL}/uploads/${filename}`;
};