// The weight of a case section's heading (design-principles.md「段落標題」「案例列」, #231): one case
// without a result or an award is too little to stand under a page-level h2, so its heading drops to
// a secondary one and the client's name is the largest word of the section. Part of `npm run test:scripts`.
export type HeadingWeight = 'primary' | 'secondary';

// A row is CaseList's item; rows built from case studies have neither field, so it takes any object
const hasProof = (row: object) => ('result' in row && !!row.result) || ('award' in row && !!row.award);

export function caseWeight(rows: readonly object[]): HeadingWeight {
  const [only, ...rest] = rows;
  return only && rest.length === 0 && !hasProof(only) ? 'secondary' : 'primary';
}
