// IA data for the M3-01 wireframes: the shared IA (src/lib/ia.ts) with links pointing to the
// wireframe of each target's template, so the prototype is clickable and never links to a route
// that does not exist yet. External links have no wireframe and no href.
import templatesCsv from '../../../docs/ia/templates.csv?raw';
import { navTree, nodes, readRows, type IaNode, type NavHref } from '../ia';

export { breadcrumb, children, node, nodes, type IaNode, type NavItem } from '../ia';

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
