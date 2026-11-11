// The privacy policy link under a form's consent checkbox opens the policy in a dialog instead of
// leaving the form (#250, PolicyDialog). The dialog's text is the policy page's own body, fetched on
// the first click: ContentTemplate marks that body with POLICY_SOURCE, and the dialog copies the
// marked element's children.

// Attribute on the policy page's body (the Prose of ContentTemplate)
export const POLICY_SOURCE = 'data-policy-source';

// The parts of a click that decide whether it opens the dialog
export type PolicyClick = {
  button: number;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  defaultPrevented: boolean;
};

// A plain primary click opens the dialog. Modified or middle clicks (new tab, new window, download)
// keep the link's own behaviour, so the policy can still be opened as a page.
export function opensInDialog(click: PolicyClick): boolean {
  return click.button === 0 && !click.ctrlKey && !click.metaKey && !click.shiftKey && !click.altKey && !click.defaultPrevented;
}
