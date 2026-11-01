
// subset-font ships no types (src/integrations/serif-fonts.ts uses it)
declare module 'subset-font' {
  export default function subsetFont(font: Buffer, text: string, options?: { targetFormat?: 'woff2' | 'woff' | 'sfnt' }): Promise<Buffer>;
}
