import OpenGraphImage, { alt as ogAlt, contentType as ogContentType, size as ogSize } from "./opengraph-image";

/* Same card for X/Twitter – one design, one place to change it. */
export const alt = ogAlt;
export const size = ogSize;
export const contentType = ogContentType;

export default function TwitterImage() {
  return OpenGraphImage();
}
