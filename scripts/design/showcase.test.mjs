// Tests for scripts/design/showcase.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { missingComponents } from './showcase.mjs';

const PAGE = `---
import Button from '../../components/ui/Button.astro';
import Card from "../../components/ui/Card.astro";
import Other from '../../components/wireframe/Tag.astro';
// import Tag from '../../components/ui/Tag.astro' is only mentioned in prose below
---
<p>Tag.astro</p>
`;

test('reports components the showcase page does not import', () => {
  assert.deepEqual(missingComponents(['Button.astro', 'Card.astro', 'Tag.astro'], PAGE.replace("// import Tag from '../../components/ui/Tag.astro'", '')), ['Tag.astro']);
});

test('imports from other folders do not count', () => {
  assert.deepEqual(missingComponents(['Tag.astro'], "import Tag from '../../components/wireframe/Tag.astro';"), ['Tag.astro']);
});

test('passes when every component is imported', () => {
  assert.deepEqual(missingComponents(['Button.astro', 'Card.astro'], PAGE), []);
});
