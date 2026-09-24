/** Converts a display name/title into a URL-safe slug, e.g. "dr. Amanda, Sp.OG" -> "dr-amanda-spog" */
export function slugify(input: string): string {
  return input
    .toString()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Appends a short numeric suffix to keep a slug unique when a collision is found. */
export function withUniqueSuffix(base: string, attempt: number): string {
  return attempt === 0 ? base : `${base}-${attempt}`;
}
