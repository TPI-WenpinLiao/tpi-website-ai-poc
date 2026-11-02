"""Merges the needed glyphs of Noto Serif TC 700 into one woff2 (#167).

Called by scripts/design/serif-subset.mjs, which picks the fontsource slices and the characters:
  python serif-subset.py <out.woff2> <chars.txt> <slice.woff2>...
Each slice is cut down to the characters it covers, then the pieces are merged. Needs fonttools
and brotli (pip install fonttools brotli).
"""

import io
import sys

from fontTools import subset
from fontTools.merge import Merger
from fontTools.ttLib import TTFont


def main() -> None:
    out, chars_file, *slices = sys.argv[1:]
    with open(chars_file, encoding="utf-8") as f:
        chars = {ord(c) for c in f.read() if c != "\n"}

    pieces = []
    for path in slices:
        font = TTFont(path)
        covered = chars & set(font.getBestCmap())
        if not covered:
            continue
        options = subset.Options()
        options.layout_features = ["*"]
        options.name_IDs = ["*"]
        options.notdef_outline = True
        options.hinting = False
        subsetter = subset.Subsetter(options)
        subsetter.populate(unicodes=covered)
        subsetter.subset(font)
        font.flavor = None
        buf = io.BytesIO()
        font.save(buf)
        buf.seek(0)
        pieces.append(buf)

    merged = Merger().merge(pieces) if len(pieces) > 1 else TTFont(pieces[0])
    merged.flavor = "woff2"
    merged.save(out)


if __name__ == "__main__":
    main()
