// Image file names and formats for migrated entries (content-migration skill「圖片」):
// src/assets/<type>/<locale>/<slug>/<lowercase-kebab-name>.<ext>, the cover is cover.<ext>.

// Formats astro:assets can process
const SIGNATURES = [
  ['jpg', (b) => b[0] === 0xff && b[1] === 0xd8],
  ['png', (b) => b.subarray(0, 4).toString('hex') === '89504e47'],
  ['gif', (b) => b.subarray(0, 4).toString('latin1') === 'GIF8'],
  ['webp', (b) => b.subarray(0, 4).toString('latin1') === 'RIFF' && b.subarray(8, 12).toString('latin1') === 'WEBP'],
  ['avif', (b) => b.subarray(4, 12).toString('latin1') === 'ftypavif'],
  ['svg', (b) => /^\s*(?:<\?xml[^>]*>\s*)?(?:<!--[\s\S]*?-->\s*)*<svg[\s>]/i.test(b.subarray(0, 2048).toString('utf8'))],
];

/** File extension from the bytes, not the URL or content-type (the sites serve images as octet-stream). */
export function imageExt(bytes) {
  return SIGNATURES.find(([, test]) => test(bytes))?.[0] ?? null;
}

/** Decode a data: URL image. */
export function dataUrlBytes(url) {
  const m = url.match(/^data:[^;,]*(;base64)?,(.*)$/s);
  if (!m) throw new Error('malformed data: URL');
  return m[1] ? Buffer.from(m[2], 'base64') : Buffer.from(decodeURIComponent(m[2]));
}

/** Lowercase kebab-case base name from a URL's last path segment; "image" when nothing Latin is left. */
export function baseName(url) {
  if (url.startsWith('data:')) return 'image';
  const last = decodeURIComponent(new URL(url).pathname.split('/').pop() ?? '');
  const stem = last.replace(/\.[a-z0-9]+$/i, '');
  return (
    stem
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60)
      .replace(/-+$/, '') || 'image'
  );
}

/**
 * Assign file names in order of appearance; the first image is the cover. Repeated names get -2, -3….
 * @param {{ url: string, ext: string }[]} images
 * @returns {Map<string, string>} url → file name
 */
export function fileNames(images) {
  const names = new Map();
  const taken = new Set();
  images.forEach(({ url, ext }, i) => {
    if (names.has(url)) return;
    const base = i === 0 ? 'cover' : baseName(url);
    let name = `${base}.${ext}`;
    for (let n = 2; taken.has(name); n++) name = `${base}-${n}.${ext}`;
    taken.add(name);
    names.set(url, name);
  });
  return names;
}
