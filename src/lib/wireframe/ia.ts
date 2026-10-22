// IA data for the M3-01 wireframes: the shared navigation (src/lib/ia/navigation.ts) with links
// pointing to the wireframe of each target's template, so the prototype is clickable and never
// links to a route that does not exist yet. External links have no wireframe and no href.
import templatesCsv from '../../../docs/ia/templates.csv?raw';
import { nodes, readRows, type IaNode } from '../ia/nodes';
import { navTree, type NavHref } from '../ia/navigation';

export { breadcrumb, children, node, type NavItem } from '../ia/navigation';
export { nodes, type IaNode } from '../ia/nodes';

export interface Template {
  id: string;
  purpose: string;
  nodes: IaNode[];
}

export const wireframeHref: NavHref = (n) => (n.template ? `/wireframes/${n.template}` : undefined);

export const utility = navTree('utility', wireframeHref);
export const header = navTree('header', wireframeHref);
export const footer = navTree('footer', wireframeHref);
export const footerBottom = navTree('footer-bottom', wireframeHref);

export const templates: Template[] = readRows(templatesCsv, 'templates.csv', ['id', 'purpose']).map((t) => ({
  ...t,
  nodes: nodes.filter((n) => n.template === t.id),
}));
