export function formatTitle(slug: string) {
  return slug
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
